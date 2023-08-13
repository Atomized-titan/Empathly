'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';
import { Gender } from '../validations/user';
import Community from '../models/community.model';

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
