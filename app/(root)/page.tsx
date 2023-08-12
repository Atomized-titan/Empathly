import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main>
      <h1 className='head-text'>Empathly</h1>
      <div>
        <UserButton afterSignOutUrl='/' />
      </div>
    </main>
  );
}
