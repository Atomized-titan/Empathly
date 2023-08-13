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
  } catch (e) {
    throw new Error(`Failed to fetch user: ${e}`);
  }
}

export async function fetchAllUsers(searchString: string, page: number, rows: number) {
  try {
    // connect to database
    connectToDatabase()
    // create regex with search string
    const regex = new RegExp(searchString, 'i');
    // get users
    const foundUsers = await User.find({ username: regex })
        // skip (offset)
        .skip((page - 1) * rows)
        // limit (rows + 1)
        .limit(rows + 1);

    return {
      users: foundUsers,
      nextPage: foundUsers.length < rows,
    };
  } catch (e) {
    throw new Error(`Failed to fetch users: ${e}`)
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
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
        termsAccepted: true,
        gender,
      },
      {
        upsert: true,
      }
    );
    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(`Failed to update user: ${error}`);
  }
}
