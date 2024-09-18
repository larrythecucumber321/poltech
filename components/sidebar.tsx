import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <aside
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-background dark:bg-background-dark transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="font-mono text-3xl text-primary dark:text-primary-dark font-bold">
          PoL Tech
        </h2>
        <button
          onClick={onClose}
          className="md:hidden text-primary dark:text-primary-dark"
        >
          <X size={24} />
        </button>
      </div>
      <nav className="mt-8">
        <ul className="text-primary dark:text-primary-dark">
          <li className="mb-2">
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Home
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/wallet"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Wallet
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/chat"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Chat
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/discover"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Discover
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
