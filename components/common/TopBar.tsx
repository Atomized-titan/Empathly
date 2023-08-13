import { SignedIn, SignOutButton, OrganizationSwitcher } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

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
