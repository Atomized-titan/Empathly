'use server';

import Bookmark from '../models/bookmark.model';
import Community from '../models/community.model';
import Feeling from '../models/feeling.model';
import User from '../models/user.model';
import { connectToDatabase } from '../mongoose';

export async function bookmarkFeeling(
  userId: string,
  feelingId: string
): Promise<void> {
  try {
    await connectToDatabase();

    // Check if the bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      user: userId,
      feeling: feelingId,
    });

    if (!existingBookmark) {
      const bookmark = new Bookmark({
        user: userId,
        feeling: feelingId,
      });

      await bookmark.save();
    }
  } catch (error: any) {
    throw new Error(`Failed to bookmark feeling: ${error.message}`);
  }
}

export async function unbookmarkFeeling(
  userId: string,
  feelingId: string
): Promise<void> {
  try {
    await connectToDatabase();

    // Remove the bookmark
    await Bookmark.findOneAndDelete({ user: userId, feeling: feelingId });
  } catch (error: any) {
    throw new Error(`Failed to unbookmark feeling: ${error.message}`);
  }
}

export async function fetchBookmarks(userId: string): Promise<any[]> {
  try {
    await connectToDatabase();

    const bookmarks = await Bookmark.find({ user: userId });

    // Extract the feeling IDs from the bookmarks
    const feelingIds = bookmarks.map((bookmark) => bookmark.feeling);

    console.time('fetch bookmark feelings');
    // Fetch the feelings using the extracted IDs
    const bookmarkedFeelings = await Feeling.find({ _id: { $in: feelingIds } })
      .populate({
        path: 'community',
        model: Community,
        select: 'name id image _id',
      })
      .populate({
        path: 'author',
        model: User,
        select: 'name image id',
      })
      .populate({
        path: 'children', // Populate the 'children' array of each feeling
        populate: {
          path: 'author', // Populate the 'author' field of each child feeling
          model: User, // Using the 'User' model to populate the 'author' field
          select: '_id name parentId image', // Include only specific fields from the 'User' document
        },
      });

    console.timeEnd('fetch bookmark feelings');

    return bookmarkedFeelings;
  } catch (error: any) {
    throw new Error(`Failed to fetch bookmarks: ${error.message}`);
  }
}

// You can similarly create a function to check if a user has bookmarked a feeling
export async function hasBookmarkedFeeling(
  userId: string,
  feelingId: string
): Promise<any> {
  try {
    await connectToDatabase();

    const existingBookmark = await Bookmark.findOne({
      user: userId,
      feeling: feelingId,
    });

    return existingBookmark !== null;
  } catch (error: any) {
    throw new Error(`Failed to check bookmark status: ${error.message}`);
  }
}
