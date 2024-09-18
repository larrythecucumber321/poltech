import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu } from "lucide-react";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-4 bg-background dark:bg-background-dark">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 text-primary dark:text-primary-dark md:hidden"
        >
          <Menu size={24} />
        </button>
        <input
          type="text"
          placeholder="Find friends or clubs..."
          className="border border-border dark:border-border-dark rounded-full px-4 py-2 w-64 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark"
        />
      </div>
      <ConnectButton />
    </header>
  );
}
