import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-background dark:bg-background-dark">
      <div className="flex items-center">
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
