'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';
import { Gender } from '../validations/user';
import Community from '../models/community.model';
import Feeling from '../models/feeling.model';

export async function fetchUser(userId: string) {
  try {
    connectToDatabase();

    return await User.findOne({ id: userId }).populate({
      path: 'communities',
      model: Community,
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
