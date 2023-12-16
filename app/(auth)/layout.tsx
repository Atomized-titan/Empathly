import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';

import '../globals.css';

export const metadata: Metadata = {
  title: 'Empathly',
  description:
    'Creating a space for open conversations on mental health. Join us in building a supportive community',
};

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang='en'
        className={`${dmSans.className} bg-dark-1 main-container`}
      >
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
