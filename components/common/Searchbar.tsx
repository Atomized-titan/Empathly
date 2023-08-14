'use client';

import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Input } from '../ui/input';

interface Props {
  routeType: string;
}

function Searchbar({ routeType }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  // query after 0.3s of no input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${routeType}?q=` + search);
      } else {
        router.push(`/${routeType}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType]);

  return (
    <div className='searchbar flex items-center'>
      <SearchIcon className='object-contain w-6 h-6 text-gray-400' />
      <Input
        id='text'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${
          routeType !== '/search' ? 'Search communities' : 'Search creators'
        }`}
        className='no-focus searchbar_input'
      />
    </div>
  );
}

export default Searchbar;
