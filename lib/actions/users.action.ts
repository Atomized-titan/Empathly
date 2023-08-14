'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';
import { Gender } from '../validations/user';
import Community from '../models/community.model';
import Feeling from '../models/feeling.model';
import { FilterQuery, SortOrder } from 'mongoose';

export async function fetchUser(userId: string) {
  try {
    connectToDatabase();

    return await User.findOne({ id: userId })
      .populate({
        path: 'communities',
        model: Community,
      })
      .populate({
        path: 'followers',
        model: User,
      })
      .populate({
        path: 'following',
        model: User,
      });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface UserValidationProps {
  name: string;
  username: string;
  bio: string;
  gender: Gender;
  userId: string;
  image: string;
  path: string;
}
export async function updateUser({
  userId,
  name,
  username,
  bio,
  image,
  gender,
  path,
}: UserValidationProps): Promise<void> {
  connectToDatabase();
  try {
    console.log('Updating user:', userId);

    const updatedData = {
      username: username.toLowerCase(),
      name,
      bio,
      image,
      onboarded: true,
      termsAccepted: true,
      gender,
    };

    console.log('Updated data:', updatedData);

    await User.findOneAndUpdate({ id: userId }, updatedData, {
      upsert: true,
    });

    console.log('User updated successfully.');

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error) {
    console.error('Failed to update user:', error);
    throw new Error(`Failed to update user: ${error}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDatabase();

    // Find all feelings authored by the user with the given userId
    const feelings = await User.findOne({ id: userId }).populate({
      path: 'feelings',
      model: Feeling,
      populate: [
        {
          path: 'community',
          model: Community,
          select: 'name id image _id', // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: 'children',
          model: Feeling,
          populate: {
            path: 'author',
            model: User,
            select: 'name image id', // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return feelings;
  } catch (error) {
    console.error('Error fetching user feelings:', error);
    throw error;
  }
}

export async function fetchUsers({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDatabase();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, 'i');

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function followUser(
  userId: string,
  targetUserId: string,
  path: string
) {
  try {
    connectToDatabase();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: targetUserId },
    });

    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: userId },
    });

    revalidatePath(path);

    return;
  } catch (error: any) {
    throw new Error(`Failed to follow user: ${error.message}`);
  }
}

export async function unfollowUser(
  userId: string,
  targetUserId: string,
  path: string
) {
  try {
    connectToDatabase();

    await User.findByIdAndUpdate(userId, {
      $pull: { following: targetUserId },
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: userId },
    });

    revalidatePath(path);
    return;
  } catch (error: any) {
    throw new Error(`Failed to unfollow user: ${error.message}`);
  }
}
