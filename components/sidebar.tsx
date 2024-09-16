import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-background dark:bg-background-dark h-screen p-4">
      <div className="aspect-auto w-[200px] h-[75px] mt-4">
        <h2 className="font-mono text-3xl text-primary dark:text-primary-dark text-2xl font-bold">
          PoL Tech
        </h2>
      </div>
      <nav>
        <ul className="text-primary dark:text-primary-dark">
          <li className="mb-2">
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/wallet" className="hover:underline">
              Wallet
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/chat" className="hover:underline">
              Chat
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/discover" className="hover:underline">
              Discover
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
