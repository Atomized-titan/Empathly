import {
  ChatBubbleBottomCenterIcon,
  ClockIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

import { formatDateStringForMobile } from '@/lib/utils';

import BookmarkButton from '../buttons/BookmarkButton';
import FeelingOptions from '../common/FeelingOptions';
import LikeButton from '../common/LikeButton';
import { Button } from '../ui/button';

interface Props {
  id: string;
  currentUserId: string;
  currentUserObjectId: string;
  parentId: string | null;
  content: string;
  image: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  community: {
    id: string;
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
  likes: string[]; // Array of user IDs who have liked the feeling
}

const FeelingCard = ({
  id,
  currentUserId,
  currentUserObjectId,
  parentId,
  content,
  image,
  author,
  community,
  createdAt,
  likes,
  comments,
  isComment,
}: Props) => {
  return (
    <article
      className={`flex w-full gap-6 flex-col rounded-xl ${
        !isComment ? 'bg-dark-2 p-7 border-dark-4 border' : 'px-0 xs:px-7 py-4'
      }  `}
    >
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
          <div className='flex flex-1 -mt-2 flex-col'>
            <Link href={`/profile/${author.id}`} className='cursor-pointer'>
              <Button variant='link' className='p-0'>
                <h3 className='text-base-medium md:text-body-medium text-light-1'>
                  {author.name}
                </h3>
              </Button>
            </Link>
            <div className='md:flex-row items-center gap-2 flex-col'>
              <p className='text-subtle-medium md:text-small-regular text-gray-400 flex items-center gap-1'>
                <ClockIcon className='w-4 h-4 text-gray-400' />{' '}
                <span>{formatDateStringForMobile(createdAt)}</span>
              </p>
              {!isComment && community && (
                <Link
                  href={`/communities/${community.id}`}
                  className='flex items-center gap-2 mt-2 md:mt-0'
                >
                  <p className='text-subtle-medium'>
                    <span className='text-light-1 hover:underline under'>
                      {community && ` In ${community.name} Community`}
                    </span>
                  </p>
                  <Image
                    src={community.image}
                    alt={community.name}
                    width={22}
                    height={22}
                    className='ml-1 rounded-full object-cover'
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className='hidden md:flex items-center gap-4'>
          <BookmarkButton
            feelingId={JSON.stringify(id)}
            userId={JSON.stringify(currentUserObjectId)}
          />
          <FeelingOptions
            feelingId={JSON.stringify(id)}
            currentUserId={currentUserId}
            authorId={author.id}
            parentId={parentId}
            isComment={isComment ?? false}
          />
        </div>
      </div>
      <div className='text-light-2 bg-dark-3 p-4 rounded-xl'>
        <p className='text-small-regular'>{content}</p>
        {image ? (
          <div className='w-full h-[300px] my-6'>
            <div className='relative w-full h-full'>
              <Image
                src={image}
                alt='feeling_image'
                layout='fill'
                objectFit='cover'
                objectPosition='center'
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className='flex items-center gap-4 text-subtle-medium text-light-1 justify-between md:justify-normal'>
        <LikeButton
          id={JSON.stringify(id)}
          currentUserObjectId={JSON.stringify(currentUserObjectId)}
          likes={likes}
        />
        <Link href={`/feeling/${id}`}>
          <div className='flex items-center gap-2'>
            <ChatBubbleBottomCenterIcon className='w-5 h-5 text-light-1' />{' '}
            <p className='flex items-center gap-1'>
              <span>{comments.length}</span>
              <span className='hidden md:block'>Comments</span>
            </p>
          </div>
        </Link>
        <div className='block md:hidden'>
          <BookmarkButton
            feelingId={JSON.stringify(id)}
            userId={JSON.stringify(currentUserObjectId)}
          />
        </div>
        <div className='flex items-center gap-2'>
          <ShareIcon className='w-4 h-4 text-light-1' />
          <span className='hidden md:block'>Share</span>
        </div>
      </div>

      {!isComment && comments.length > 0 && (
        <div className='ml-1 mt-3 flex items-center gap-2'>
          {comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && '-ml-5'} rounded-full object-cover`}
            />
          ))}

          <Link href={`/feeling/${id}`}>
            <p className='mt-1 text-subtle-medium text-gray-1'>
              {comments.length} repl{comments.length > 1 ? 'ies' : 'y'}
            </p>
          </Link>
        </div>
      )}
    </article>
  );
};

export default FeelingCard;
