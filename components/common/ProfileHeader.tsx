import Link from 'next/link';
import Image from 'next/image';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: string;
}

function ProfileHeader({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
}: Props) {
  return (
    <div className='flex w-full flex-col justify-start'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='relative h-20 w-20 object-cover'>
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
            <p className='text-base-medium text-gray-1'>@{username}</p>
          </div>
        </div>
        {accountId === authUserId && type !== 'Community' && (
          <Link href='/profile/edit'>
            <Button className='flex cursor-pointer gap-3 items-center rounded-lg bg-dark-3 px-4 py-2'>
              <PencilIcon className='w-4 h-4 text-light-1' />

              <p className='text-light-2 max-sm:hidden'>Edit</p>
            </Button>
          </Link>
        )}
      </div>

      <p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>

      <div className='mt-12 h-0.5 w-full bg-dark-3' />
    </div>
  );
}

export default ProfileHeader;
