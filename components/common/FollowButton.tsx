import { PlusIcon } from '@heroicons/react/24/outline';
import { useHover } from '@uidotdev/usehooks';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { followUser, unfollowUser } from '@/lib/actions/user.action';

import { Button } from '../ui/button';

interface Props {
  accountId: string;
  authUserId: string;
  isFollowing: boolean;
  followersCount: number;
}

const FollowButton = ({
  accountId,
  authUserId,
  isFollowing,
  followersCount,
}: Props) => {
  const [isUserFollowing, setIsUserFollowing] = useState(isFollowing);
  const [followerCount, setFollowerCount] = useState(followersCount);
  const pathName = usePathname();
  const parsedAccountId = JSON.parse(accountId);
  const parsedAuthUserId = JSON.parse(authUserId);

  const [ref, hovering] = useHover<HTMLButtonElement>();

  const handleFollow = async () => {
    try {
      // Optimistically update the UI
      setIsUserFollowing(true);
      setFollowerCount(followerCount + 1);

      // Call the API to follow the user
      await followUser(parsedAuthUserId, parsedAccountId, pathName);
    } catch (error) {
      console.error('Error following user:', error);
      // Handle error (display a message, etc.)
      setIsUserFollowing(false); // Revert the UI state
      setFollowerCount(followerCount); // Revert the follower count
    }
  };

  const handleUnfollow = async () => {
    try {
      // Optimistically update the UI
      setIsUserFollowing(false);
      setFollowerCount(followerCount - 1);

      // Call the API to unfollow the user
      await unfollowUser(parsedAuthUserId, parsedAccountId, pathName);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      // Handle error (display a message, etc.)
      setIsUserFollowing(true); // Revert the UI state
      setFollowerCount(followerCount); // Revert the follower count
    }
  };

  return (
    <Button
      onClick={async () => {
        if (isUserFollowing) {
          await handleUnfollow();
        } else {
          await handleFollow();
        }
      }}
      ref={ref}
      className={`${
        isUserFollowing
          ? 'bg-dark-3 hover:bg-dark-4'
          : 'bg-light-1 hover:bg-slate-200'
      } flex cursor-pointer gap-3 items-center rounded-lg  px-4 py-2`}
    >
      <div className='flex items-center gap-2'>
        {isUserFollowing ? null : <PlusIcon className='w-5 h-5 text-dark-3' />}
        <span
          className={`${
            isUserFollowing ? 'text-light-1' : 'text-dark-3'
          } transition-colors ease-in-out duration-300`}
          style={{
            color: isUserFollowing && hovering ? 'red' : '',
          }}
        >
          {!isUserFollowing ? 'Follow' : hovering ? 'Unfollow' : 'Following'}
        </span>
      </div>
    </Button>
  );
};

export default FollowButton;
