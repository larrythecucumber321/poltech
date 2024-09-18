"use client";

import { useState, useEffect } from "react";
import { request } from "graphql-request";
import { LEADERBOARD_QUERY } from "@/lib/graphql/leaderboardQuery";

const API_URL =
  "https://api.goldsky.com/api/public/project_clq1h5ct0g4a201x18tfte5iv/subgraphs/bgt-subgraph/v0.0.2/gn";

type LeaderboardEntry = {
  id: string;
  user: string;
  amount: string;
  vault: {
    id: string;
    vaultAddress: string;
  };
};

export function useLeaderboard(vaultId: string, limit: number = 10) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await request(API_URL, LEADERBOARD_QUERY, {
          first: limit,
          vaultId: vaultId,
        });
        setLeaderboard(data.userVaultDeposits_collection);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [vaultId, limit]);

  return { leaderboard, loading, error };
}
