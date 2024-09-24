"use client";

import { useLeaderboard } from "@/app/hooks/useLeaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VAULT_CONTRACT_ADDRESS } from "@/lib/constants";
import { useAccount } from "wagmi";
import { formatEther } from "viem";

export default function Leaderboard() {
  const { address } = useAccount();
  const {
    leaderboard,
    loading,
    error,
    earnedRewards,
    claimRewards,
    isClaimingRewards,
    isClaimConfirmed,
  } = useLeaderboard(VAULT_CONTRACT_ADDRESS, 10);

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
              className={`flex items-center justify-between p-4 rounded-lg ${
                entry.user.toLowerCase() === address?.toLowerCase()
                  ? "bg-primary/20 dark:bg-primary-dark/20"
                  : "bg-secondary dark:bg-secondary-dark"
              }`}
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
              {entry.user.toLowerCase() === address?.toLowerCase() && (
                <div className="flex flex-col items-end">
                  <p className="text-sm text-foreground-muted dark:text-foreground-muted-dark">
                    Pending Rewards:{" "}
                    {earnedRewards ? formatEther(earnedRewards) : "0"} BGT
                  </p>
                  <Button
                    onClick={claimRewards}
                    disabled={
                      isClaimingRewards ||
                      !earnedRewards ||
                      earnedRewards === BigInt(0)
                    }
                    className="mt-2 bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-background dark:text-background-dark"
                  >
                    {isClaimingRewards
                      ? "Claiming..."
                      : isClaimConfirmed
                      ? "Claimed!"
                      : "Claim Rewards"}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
