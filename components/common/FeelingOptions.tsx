'use client';

import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';

import { deleteFeeling } from '@/lib/actions/feeling.action';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '../ui/button';
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

  if (currentUserId !== authorId || pathname === '/') return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant='ghost' size='icon'>
          <EllipsisVerticalIcon className='w-6 h-6 text-light-1' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-dark-3 border-dark-4 text-light-2'>
        <DropdownMenuItem className=' focus:bg-dark-4 focus:text-light-1'>
          Edit
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
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FeelingOptions;
