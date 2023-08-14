'use server';

import { startSession } from 'mongoose';
import { revalidatePath } from 'next/cache';

import Community from '../models/community.model';
import Feeling from '../models/feeling.model';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';

interface Params {
  text: string;
  image: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createFeeling({
  text,
  author,
  image,
  communityId,
  path,
}: Params) {
  try {
    await connectToDatabase();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdFeeling = await Feeling.create({
      text,
      author,
      image,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { feelings: createdFeeling._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { feelings: createdFeeling._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create feeling: ${error.message}`);
  }
}

export async function fetchFeelings(pageNumber = 1, pageSize = 20) {
  try {
    await connectToDatabase();

    // number of posts to skip depending on which page we're on
    const skipAmount = (pageNumber - 1) * pageSize;

    // Construct a MongoDB query to retrieve top-level feelings (posts)
    const postsQuery = Feeling.find({
      parentId: { $in: [null, undefined] }, // Find feelings without a parent (root feelings)
    })
      .sort({ createdAt: 'desc' }) // Sort the retrieved feelings by creation time in descending order
      .skip(skipAmount) // Skip a specified number of feelings based on pagination
      .limit(pageSize) // Limit the number of retrieved feelings per page
      // Populate the retrieved feelings with additional data
      .populate({
        path: 'author', // Populate the 'author' field of each feeling
        model: User, // Using the 'User' model to populate the 'author' field
      })
      .populate({
        path: 'children', // Populate the 'children' array of each feeling
        populate: {
          path: 'author', // Populate the 'author' field of each child feeling
          model: User, // Using the 'User' model to populate the 'author' field
          select: '_id name parentId image', // Include only specific fields from the 'User' document
        },
      });

    const totalPostsCount = await Feeling.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > posts.length + skipAmount;
    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch feelings: ${error.message}`);
  }
}

export async function fetchFeelingById(feelingId: string) {
  await connectToDatabase();

  try {
    const feeling = await Feeling.findById(feelingId)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      }) // Populate the author field with _id and username
      .populate({
        path: 'community',
        model: Community,
        select: '_id id name image',
      }) // Populate the community field with _id and name
      .populate({
        path: 'children', // Populate the children field
        populate: [
          {
            path: 'author', // Populate the author field within children
            model: User,
            select: '_id id name parentId image', // Select only _id and username fields of the author
          },
          {
            path: 'children', // Populate the children field within children
            model: Feeling, // The model of the nested children (assuming it's the same "Feeling" model)
            populate: {
              path: 'author', // Populate the author field within nested children
              model: User,
              select: '_id id name parentId image', // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return feeling;
  } catch (err) {
    console.error('Error while fetching feeling:', err);
    throw new Error('Unable to fetch feeling');
  }
}

export async function addCommentToFeeling(
  feelingId: string,
  commentText: string,
  userId: string,
  path: string
) {
  await connectToDatabase();

  try {
    // Find the original feeling by its ID
    const originalFeeling = await Feeling.findById(feelingId);

    if (!originalFeeling) {
      throw new Error('Feeling not found');
    }

    // Create the new comment feeling
    const commentFeeling = new Feeling({
      text: commentText,
      author: userId,
      parentId: feelingId, // Set the parentId to the original feeling's ID
    });

    // Save the comment feeling to the database
    const savedCommentFeeling = await commentFeeling.save();

    // Add the comment feeling's ID to the original feeling's children array
    originalFeeling.children.push(savedCommentFeeling._id);

    // Save the updated original feeling to the database
    await originalFeeling.save();

    revalidatePath(path);
  } catch (err) {
    console.error('Error while adding comment:', err);
    throw new Error('Unable to add comment');
  }
}

// Add a like to a feeling
export async function likeFeeling(feelingId: string, userId: string) {
  await connectToDatabase();

  const session = await startSession();
  session.startTransaction();

  try {
    const feeling = await Feeling.findById(feelingId).session(session);

    if (!feeling) {
      throw new Error('Feeling not found');
    }

    if (feeling.likes.includes(userId)) {
      throw new Error('User has already liked this feeling');
    }

    feeling.likes.push(userId);

    await feeling.save();

    await session.commitTransaction();
    session.endSession();

    console.log('Feeling after like:', feeling);
  } catch (err) {
    console.error('Error while liking feeling:', err);
    await session.abortTransaction();
    session.endSession();
    throw new Error('Unable to like feeling');
  }
}

// Remove a like from a feeling
export async function unlikeFeeling(feelingId: string, userId: string) {
  await connectToDatabase();

  const session = await startSession();
  session.startTransaction();

  try {
    const feeling = await Feeling.findById(feelingId).session(session);

    if (!feeling) {
      throw new Error('Feeling not found');
    }

    feeling.likes = feeling.likes.filter(
      (likeUserId: string) => likeUserId.toString() !== userId
    );

    await feeling.save();

    await session.commitTransaction();
    session.endSession();

    console.log('Feeling after unlike:', feeling);
  } catch (err) {
    console.error('Error while unliking feeling:', err);
    await session.abortTransaction();
    session.endSession();
    throw new Error('Unable to unlike feeling');
  }
}
