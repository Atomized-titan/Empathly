'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarIcon,
  EnvelopeIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import FollowButton from './FollowButton';

interface Props {
  accountId: string;
  accountObjectId: string;
  authUserId: string;
  authUserObjectId: string;
  name: string;
  username: string;
  imgUrl: string;
  coverImgUrl?: string;
  bio: string;
  type?: string;
  createdAt: number;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
  doesAccountFollowAuthUser: boolean;
}

function ProfileHeader({
  accountId,
  accountObjectId,
  authUserId,
  authUserObjectId,
  name,
  username,
  imgUrl,
  bio,
  coverImgUrl,
  createdAt,
  type,
  isFollowing,
  followersCount,
  followingCount,
  doesAccountFollowAuthUser,
}: Props) {
  return (
    <div className='flex w-full flex-col justify-start'>
      <div className='relative h-40 w-full object-cover'>
        <Image
          src={coverImgUrl || '/assets/default-cover.jpg'}
          alt='cover image'
          layout='fill'
          className='object-cover'
          loading='lazy'
        />
      </div>
      <div className='flex items-center justify-between px-4'>
        <div className='flex items-center gap-3'>
          <div className='relative h-24 w-24 object-cover -mt-4'>
            <Image
              src={imgUrl}
              alt='logo'
              fill
              className='rounded-full object-cover shadow-2xl'
            />
          </div>

          <div className='flex-1'>
            <h2 className='text-left text-heading3-bold text-light-1'>
              {name}
            </h2>
            <div className='flex items-center gap-2'>
              <p className='text-base-medium text-gray-1'>@{username}</p>
              {doesAccountFollowAuthUser ? (
                <p className='text-subtle-medium text-gray-1 px-2 py-1 bg-dark-4 rounded-lg'>
                  Follows you
                </p>
              ) : null}
            </div>
          </div>
        </div>
        {accountId === authUserId && type !== 'Community' ? (
          <Link href='/profile/edit'>
            <Button className='flex cursor-pointer gap-3 items-center rounded-lg bg-dark-3 px-4 py-2'>
              <PencilIcon className='w-4 h-4 text-light-1' />
              <p className='text-light-2 max-sm:hidden'>Edit</p>
            </Button>
          </Link>
        ) : (
          <FollowButton
            accountId={JSON.stringify(accountObjectId)}
            authUserId={JSON.stringify(authUserObjectId)}
            followersCount={followersCount}
            isFollowing={isFollowing}
          />
        )}
      </div>
      {/* BIO SECTION */}
      <p className='mt-4 max-w-lg text-base-regular text-light-2 px-4'>{bio}</p>

      <div>
        <div className='p-4 text-light-1 flex flex-col gap-2'>
          <p className='text-base-medium mb-2 flex items-center gap-2'>
            <MapPinIcon className='w-5 h-5' />
            <span>Location: New York, USA</span>
          </p>
          <p className='text-base-medium mb-2 flex items-center gap-2'>
            <LinkIcon className='w-5 h-5' />
            <span>
              Website:{' '}
              <a
                href='https://example.com'
                className='text-primary hover:underline'
              >
                example.com
              </a>
            </span>
          </p>
          <p className='text-base-medium mb-2 flex items-center gap-2'>
            <EnvelopeIcon className='w-5 h-5' />
            <span>
              Contact:{' '}
              <a
                href='mailto:user@example.com'
                className='text-primary hover:underline'
              >
                user@example.com
              </a>
            </span>
          </p>
          <div className='text-base-regular text-dark-5 flex items-center gap-2'>
            <CalendarIcon className='w-5 h-5' />{' '}
            <span>Joined {new Date(createdAt).toDateString()}</span>
          </div>

          {/* // count of followers and following */}
          <div>
            <p className='text-base-medium mb-2 flex items-center gap-2'>
              <span>Followers: {followersCount}</span>
            </p>
            <p className='text-base-medium mb-2 flex items-center gap-2'>
              <span>Following: {followingCount}</span>
            </p>
          </div>
        </div>
      </div>
      <div className='mt-12 h-0.5 w-full bg-dark-3' />
    </div>
  );
}

export default ProfileHeader;
