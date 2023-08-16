'use client';

import { HeartIcon } from '@heroicons/react/24/outline';
import React, { experimental_useOptimistic, useState } from 'react';

import { likeFeeling, unlikeFeeling } from '@/lib/actions/feeling.action';

interface Props {
  id: string;
  currentUserObjectId: string;
  likes: string[];
}

const LikeButton = ({ id, currentUserObjectId, likes }: Props) => {
  const parsedCurrentUserObjectId = JSON.parse(currentUserObjectId);
  const parsedId = JSON.parse(id);
  const [isLiked, setIsLiked] = useState(
    likes.includes(parsedCurrentUserObjectId)
  );
  const [likeCount, setLikeCount] = useState(likes.length);
  const [optimisticLikesCount, setOptimisticLikesCount] =
    experimental_useOptimistic(likeCount);

  const handleLike = async () => {
    try {
      // Optimistically update the UI
      setIsLiked(true);

      setOptimisticLikesCount((p) => p + 1);
      // Call the API to like the feeling
      await likeFeeling(parsedId, parsedCurrentUserObjectId);
      setLikeCount((p) => p + 1);

      // Server confirmation will be handled in the catch block if there's an error
    } catch (error) {
      console.error('Error liking feeling:', error);
      // Handle error (display a message, etc.)
      setIsLiked(false); // Revert the UI state
      setLikeCount((p) => p); // Revert the like count
    }
  };

  const handleUnlike = async () => {
    try {
      // Optimistically update the UI
      setIsLiked(false);
      setLikeCount(likeCount - 1);

      // Call the API to unlike the feeling
      await unlikeFeeling(parsedId, parsedCurrentUserObjectId);

      // Server confirmation will be handled in the catch block if there's an error
    } catch (error) {
      console.error('Error unliking feeling:', error);
      // Handle error (display a message, etc.)
      setIsLiked(true); // Revert the UI state
      setLikeCount(likeCount); // Revert the like count
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
      <div className='flex items-center gap-2'>
        <HeartIcon
          className={`w-5 h-5 ${
            isLiked ? 'fill-primary text-primary !font-medium' : 'text-light-1'
          }`}
        />
        <span
          className={`${isLiked ? 'text-primary' : ''} flex items-center gap-1`}
        >
          <span>{optimisticLikesCount} </span>
          <span className='hidden md:flex'>
            {' '}
            Like{optimisticLikesCount !== 1 ? 's' : ''}
          </span>
        </span>
      </div>
    </button>
  );
};

export default LikeButton;
