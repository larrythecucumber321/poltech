"use client";

import Leaderboard from "@/components/leaderboard";

export default function DiscoverPage() {
  return (
    <div className="h-[calc(100vh-64px)] bg-background dark:bg-background-dark p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary dark:text-primary-dark">
        PoL Leaderboard
      </h1>
      <Leaderboard />
    </div>
  );
}
