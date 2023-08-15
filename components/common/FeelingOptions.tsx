'use client';

import {
  EllipsisVerticalIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';

import { deleteFeeling } from '@/lib/actions/feeling.action';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  feelingId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment: boolean;
}
const FeelingOptions = ({
  feelingId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVerticalIcon className='w-6 h-6 text-light-1' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-dark-3 border-dark-4 text-light-2'>
        <DropdownMenuItem className=' focus:bg-dark-4 focus:text-light-1'>
          <div className='flex items-center gap-3'>
            <FlagIcon className='w-6 h-6 text-light-1' />
            <span>Report post</span>
          </div>
        </DropdownMenuItem>
        {currentUserId !== authorId ? null : (
          <>
            <DropdownMenuItem className=' focus:bg-dark-4 focus:text-light-1'>
              <div className='flex items-center gap-3'>
                <PencilIcon className='w-6 h-6 text-light-1' />
                <span>Edit</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await deleteFeeling(JSON.parse(feelingId), pathname);
                if (!parentId || !isComment) {
                  router.push('/');
                }
              }}
              className='text-red-500 focus:bg-red-950 focus:text-red-500'
            >
              <div className='flex items-center gap-3'>
                <TrashIcon className='w-6 h-6 ' />
                <span>Delete</span>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeelingOptions;
