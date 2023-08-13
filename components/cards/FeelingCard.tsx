import { formatDateString } from '@/lib/utils';
import {
  BookmarkIcon,
  ChatBubbleBottomCenterIcon,
  ClockIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import LikeButton from '../common/LikeButton';
import { Button } from '../ui/button';

interface Props {
  id: string;
  currentUserId: string;
  currentUserObjectId: string;
  parentId: string;
  content: string;
  image: string;
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
          <div className='flex flex-1 -mt-2 flex-col gap-1'>
            <Link href={`/profile/${author.id}`} className='cursor-pointer'>
              <Button variant='link' className='p-0'>
                <h3 className='text-base-medium md:text-body-medium text-light-1'>
                  {author.name}
                </h3>
              </Button>
            </Link>
            <p className='text-subtle-medium -mt-2 md:text-small-regular text-gray-400 flex items-center gap-1'>
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

      <div className='flex items-center gap-4 text-subtle-medium text-light-1'>
        <LikeButton
          id={id}
          currentUserObjectId={currentUserObjectId}
          likes={likes}
        />
        <Link href={`/feeling/${id}`}>
          <div className='flex items-center gap-1'>
            <ChatBubbleBottomCenterIcon className='w-5 h-5 text-light-1' />{' '}
            <span>{comments.length} Comments</span>
          </div>
        </Link>
        <div className='flex items-center gap-1'>
          <ShareIcon className='w-5 h-5 text-light-1' /> Share
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