import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-border dark:border-border-dark`}
    >
      <div className="flex justify-between items-center p-4 bg-primary dark:bg-primary-dark">
        <h2 className="text-xl font-bold text-background dark:text-background-dark">
          Menu
        </h2>
        <Button
          onClick={onClose}
          className="text-background dark:text-background-dark md:hidden hover:bg-primary-light dark:hover:bg-primary"
        >
          <X size={24} />
        </Button>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-secondary hover:text-foreground dark:hover:bg-secondary-dark dark:hover:text-foreground-dark"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/wallet"
              className="block px-4 py-2 hover:bg-secondary hover:text-foreground dark:hover:bg-secondary-dark dark:hover:text-foreground-dark"
            >
              Wallet
            </Link>
          </li>
          <li>
            <Link
              href="/chat"
              className="block px-4 py-2 hover:bg-secondary hover:text-foreground dark:hover:bg-secondary-dark dark:hover:text-foreground-dark"
            >
              Chat
            </Link>
          </li>
          <li>
            <Link
              href="/discover"
              className="block px-4 py-2 hover:bg-secondary hover:text-foreground dark:hover:bg-secondary-dark dark:hover:text-foreground-dark"
            >
              Discover
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
