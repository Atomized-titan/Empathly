'use server';

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
    connectToDatabase();

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
      $push: { feeling: createdFeeling._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { feeling: createdFeeling._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create feeling: ${error.message}`);
  }
}

export async function fetchFeelings(pageNumber = 1, pageSize = 20) {
  try {
    connectToDatabase();

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
