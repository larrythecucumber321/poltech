"use client";

import Leaderboard from "@/components/leaderboard";

export default function DiscoverPage() {
  return (
    <div className="container mx-auto p-4 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary dark:text-primary-dark">
        Leaderboard
      </h1>
      <Leaderboard />
    </div>
  );
}
