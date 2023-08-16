'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarLinks } from '@/constants';

const BottomBar = () => {
  const pathname = usePathname();

  return (
    <section className='bottombar'>
      <div className='bottombar_container'>
        <div className='bottombar_scrollable'>
          {sidebarLinks.map((link) => {
            const isActive =
              (pathname.includes(link.route) && link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link
                href={link.route}
                key={link.label}
                className={`bottombar_link text-light-1 ${
                  isActive && 'bg-primary'
                }`}
              >
                <link.icon className='w-6 h-6' />
                <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                  {link.label.split(/\s+/)[0]}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BottomBar;
