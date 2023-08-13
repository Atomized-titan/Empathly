import { formatDateString } from '@/lib/utils';
import { BookmarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';

interface Props {
  id: string;
  currentUserId: string;
  parentId: string;
  content: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  community: {
    _id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const FeelingCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
}: Props) => {
  return (
    <article className='flex w-full gap-6 flex-col rounded-xl bg-dark-2 p-7 border border-dark-4'>
      <div className='flex justify-between items-center'>
        <div className='flex flex-1 items-center gap-4'>
          <Link href={`/profile/${author.id}`} className='relative h-12 w-12'>
            <Image
              src={author.image}
              alt='user_community_image'
              fill
              className='cursor-pointer rounded-full'
            />
          </Link>
          <div className='flex flex-1 flex-col gap-1'>
            <h3 className='text-base-medium md:text-body-medium text-light-1'>
              {author.name}
            </h3>
            <p className='text-subtle-medium md:text-small-regular text-gray-400 flex items-center gap-1'>
              <ClockIcon className='w-4 h-4 text-gray-400' />{' '}
              <span>{formatDateString(createdAt)}</span>
            </p>
          </div>
        </div>
        <div className='hidden md:flex items-center gap-4'>
          <Button variant='ghost' size='icon'>
            <BookmarkIcon className='w-6 h-6 text-light-1' />
          </Button>
          <Button variant='ghost' size='icon'>
            <EllipsisVerticalIcon className='w-6 h-6 text-light-1' />
          </Button>
        </div>
      </div>
      <h2 className='text-small-regular text-light-2'>{content}</h2>
    </article>
  );
};

export default FeelingCard;
