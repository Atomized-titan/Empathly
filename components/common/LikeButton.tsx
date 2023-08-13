'use client';

import React, { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { likeFeeling, unlikeFeeling } from '@/lib/actions/feeling.actions';

interface Props {
  id: string;
  currentUserObjectId: string;
  likes: string[];
}

const LikeButton = ({ id, currentUserObjectId, likes }: Props) => {
  const [isLiked, setIsLiked] = useState(likes.includes(currentUserObjectId));

  const handleLike = async () => {
    try {
      // Optimistically update the UI
      setIsLiked(true);

      // Call the API to like the feeling
      await likeFeeling(id, currentUserObjectId);

      // Server confirmation will be handled in the catch block if there's an error
    } catch (error) {
      console.error('Error liking feeling:', error);
      // Handle error (display a message, etc.)
      setIsLiked(false); // Revert the UI state
    }
  };

  const handleUnlike = async () => {
    try {
      // Optimistically update the UI
      setIsLiked(false);

      // Call the API to unlike the feeling
      await unlikeFeeling(id, currentUserObjectId);

      // Server confirmation will be handled in the catch block if there's an error
    } catch (error) {
      console.error('Error unliking feeling:', error);
      // Handle error (display a message, etc.)
      setIsLiked(true); // Revert the UI state
    }
  };

  return (
    <button
      onClick={async () => {
        if (isLiked) {
          await handleUnlike();
        } else {
          await handleLike();
        }
      }}
    >
      <div className='flex items-center gap-1'>
        <HeartIcon
          className={`w-5 h-5 ${isLiked ? 'fill-primary' : 'text-light-1'}`}
        />
        {isLiked ? (
          <span className='text-primary'>Liked</span>
        ) : (
          <span>{likes.length} Likes</span>
        )}
      </div>
    </button>
  );
};

export default LikeButton;
