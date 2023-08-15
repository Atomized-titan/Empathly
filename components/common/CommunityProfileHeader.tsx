'use client';

import { PencilIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../ui/button';

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  coverImgUrl?: string;
  bio: string;
  type?: string;
  createdAt: number;
  memberCount: number;
  top5UserImages: string[];
}

function CommunityProfileHeader({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  coverImgUrl,
  type,
  memberCount,
  top5UserImages,
}: Props) {
  return (
    <div>
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
              <div className='flex items-center gap-2'>
                <h2 className='text-left text-heading3-bold text-light-1'>
                  {' '}
                  {name}
                </h2>
                <p className='text-subtle-medium !text-primary-orange px-2 py-1 bg-dark-4 rounded-lg'>
                  Organisation
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-base-medium text-gray-1'>@{username}</p>
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
          ) : // <Button>Join</Button>
          null}
        </div>
        {/* BIO SECTION */}
        <p className='mt-4 max-w-lg text-base-regular text-light-2 px-4'>
          {bio}
        </p>
      </div>
      <Button
        variant='ghost'
        className='text-light-1 hover:text-light-2 mt-4 hover:bg-dark-4'
      >
        <div className='flex items-center gap-2 my-4'>
          {top5UserImages?.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`user_${index}`}
              width={32}
              height={32}
              className={`${index !== 0 && '-ml-5'} rounded-full object-cover`}
            />
          ))}
          <span className='text-base-bold'>{memberCount}</span>{' '}
          <span className='text-base-regular'>Members</span>
        </div>
      </Button>
      <div className='mt-2 h-0.5 w-full bg-dark-3' />
    </div>
  );
}

export default CommunityProfileHeader;
