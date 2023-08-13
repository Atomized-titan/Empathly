import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';

import '../globals.css';

import BottomBar from '@/components/common/BottomBar';
import LeftSideBar from '@/components/common/LeftSideBar';
import RightSideBar from '@/components/common/RightSideBar';
import TopBar from '@/components/common/TopBar';
import Providers from '@/components/common/Providers';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Empathly',
  description:
    'Creating a space for open conversations on mental health. Join us in building a supportive community',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={dmSans.className}>
          <Providers>
            <TopBar />
            <main className='flex flex-row'>
              <LeftSideBar />
              <section className='main-container'>
                <div className='w-full max-w-4xl'>{children}</div>
              </section>
              <RightSideBar />
            </main>
            <BottomBar />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
