import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-4 bg-background dark:bg-background-dark border-b border-border dark:border-border-dark">
      <div className="flex items-center">
        <Button
          onClick={onMenuClick}
          className="mr-4 text-primary dark:text-primary-dark md:hidden hover:bg-secondary dark:hover:bg-secondary-dark"
        >
          <Menu size={24} />
        </Button>
        <h1 className="text-2xl font-bold text-primary dark:text-primary-dark">
          POLTech
        </h1>
      </div>
      <ConnectButton />
    </header>
  );
}
