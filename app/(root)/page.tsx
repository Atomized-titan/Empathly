import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      <h1>Empathly</h1>
      <div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </main>
  );
}
