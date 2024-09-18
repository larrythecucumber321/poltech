"use client";

import { useLeaderboard } from "@/app/hooks/useLeaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Leaderboard() {
  const { leaderboard, loading, error } = useLeaderboard(
    "0xf2a76dbcff01a0d84e5d32302a45998899ab6503",
    10
  );

  if (loading) return <p>Loading leaderboard...</p>;
  if (error) return <p>Error loading leaderboard: {error.message}</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary dark:text-primary-dark">
          Top Stakers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 bg-secondary dark:bg-secondary-dark rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-primary dark:text-primary-dark">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-foreground dark:text-foreground-dark">
                    {entry.user.slice(0, 6)}...{entry.user.slice(-4)}
                  </p>
                  <p className="text-sm text-foreground-muted dark:text-foreground-muted-dark">
                    {parseFloat(entry.amount).toFixed(4)} BERA
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
