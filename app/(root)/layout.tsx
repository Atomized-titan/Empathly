import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Empathly",
  description:
    "Creating a space for open conversations on mental health. Join us in building a supportive community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={dmSans.className}>
          {/* <TopBar /> */}
          <main>
            {/* <LeftSidebar /> */}
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            {/* <RightSidebar /> */}
          </main>
          {/* <BottomBar /> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
