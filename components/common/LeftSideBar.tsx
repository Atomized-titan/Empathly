'use client';

import { sidebarLinks } from '@/constants';
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { useSpring, animated } from 'react-spring';

const LeftSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { userId } = useAuth();

  // State to manage the sidebar open/close animation
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Define animation properties using useSpring
  const sidebarAnimation = useSpring({
    width: isSidebarOpen ? 250 : 107, // Adjust the widths as needed
  });

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <animated.section
      className='custom-scrollbar leftsidebar'
      style={sidebarAnimation}
      onMouseEnter={toggleSidebar} // Open sidebar on hover
      onMouseLeave={toggleSidebar} // Close sidebar when leaving
    >
      <div className='flex w-full flex-1 flex-col gap-6 px-6'>
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          if (link.route === '/profile') link.route = `${link.route}/${userId}`;

          return (
            <Link
              key={link.label}
              href={link.route}
              className={`leftsidebar_link text-light-1  ${
                isActive ? 'bg-primary' : 'hover:text-primary'
              }`}
            >
              <link.icon className='w-6 h-6' />
              {isSidebarOpen && <span>{link.label}</span>}
            </Link>
          );
        })}
      </div>
      <div className='mt-10 px-6'>
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push('/sign-in')}>
            <div className='flex cursor-pointer gap-4 p-4 items-center group '>
              <ArrowLeftOnRectangleIcon className='w-5 h-5 text-light-1 group-hover:text-primary' />
              {isSidebarOpen && (
                <p className='text-light-2 max-lg:hidden group-hover:text-primary'>
                  Logout
                </p>
              )}
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </animated.section>
  );
};

export default LeftSideBar;
