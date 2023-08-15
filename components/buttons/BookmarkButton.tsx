'use client';

import { BookmarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

import {
  bookmarkFeeling,
  hasBookmarkedFeeling,
  unbookmarkFeeling,
} from '@/lib/actions/bookmark.action';

interface Props {
  feelingId: string;
  userId: string;
}

const BookmarkButton = ({ feelingId, userId }: Props) => {
  const parsedUserId = JSON.parse(userId);
  const parsedFeelingId = JSON.parse(feelingId);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Fetch bookmarks when the component mounts
    async function fetchData() {
      try {
        setIsBookmarked(
          await hasBookmarkedFeeling(parsedUserId, parsedFeelingId)
        );
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    }

    fetchData();
  }, [parsedUserId, parsedFeelingId]);

  const handleBookmark = async () => {
    try {
      // Optimistically update the UI
      setIsBookmarked(true);

      // Call the API to bookmark the feeling
      await bookmarkFeeling(parsedUserId, parsedFeelingId);

      // Server confirmation will be handled in the catch block if there's an error
    } catch (error) {
      console.error('Error bookmarking feeling:', error);
      // Handle error (display a message, etc.)
      setIsBookmarked(false); // Revert the UI state
    }
  };

  const handleUnbookmark = async () => {
    try {
      // Optimistically update the UI
      setIsBookmarked(false);

      // Call the API to unbookmark the feeling
      await unbookmarkFeeling(parsedUserId, parsedFeelingId);

      // Server confirmation will be handled in the catch block if there's an error
    } catch (error) {
      console.error('Error unbookmarking feeling:', error);
      // Handle error (display a message, etc.)
      setIsBookmarked(true); // Revert the UI state
    }
  };
  return (
    <button
      onClick={async () => {
        if (isBookmarked) {
          await handleUnbookmark();
        } else {
          await handleBookmark();
        }
      }}
    >
      <div className='flex items-center gap-2'>
        <BookmarkIcon
          className={`w-5 h-5 ${
            isBookmarked
              ? 'fill-primary text-primary !font-medium'
              : 'text-light-1'
          }`}
        />
        <span className={`${isBookmarked ? 'text-primary' : ''}`}>
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      </div>
    </button>
  );
};

export default BookmarkButton;
