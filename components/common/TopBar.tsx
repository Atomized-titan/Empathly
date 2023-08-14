import { OrganizationSwitcher, SignedIn, SignOutButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

import Searchbar from './Searchbar';

const TopBar = () => {
  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'>
        <Image
          src='/logo.png'
          alt='logo'
          width={32}
          height={32}
          priority
          quality={100}
          unoptimized
        />
        <p className='text-heading3-bold text-light-1 max-xs:hidden'>
          Empathly
        </p>
      </Link>
      <div className='flex items-center gap-1'>
        <Link href={'/search'}>
          <button className='relative'>
            <Searchbar routeType='search' />
            <div className='w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
          </button>
        </Link>
        <div className='block md:hidden'>
          <SignedIn>
            <SignOutButton>
              <div className='flex cursor-pointer'>
                <ArrowLeftOnRectangleIcon className='w-6 h-6 text-light-1' />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: 'py-2 px-4',
            },
          }}
        />
      </div>
    </nav>
  );
};

export default TopBar;
