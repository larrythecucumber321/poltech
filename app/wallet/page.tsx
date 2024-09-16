"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { useWriteContract } from "wagmi";
import {
  useGetSharesBalance,
  useGetSharePrice,
} from "@/app/hooks/useShareTrading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useSearchParams } from "next/navigation";
import polTechABI from "@/lib/abi/polTech.json";

const POL_TECH_CONTRACT_ADDRESS =
  "0x1234567890123456789012345678901234567890" as const;

export default function WalletPage() {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "";

  const { data: sharesBalance } = useGetSharesBalance(
    (address as `0x${string}`) || "0x",
    subject as `0x${string}`
  );
  const { data: sharePrice } = useGetSharePrice(subject as `0x${string}`);
  const { writeContract: buyShares, isPending: isBuying } = useWriteContract();
  const { writeContract: sellShares, isPending: isSelling } =
    useWriteContract();

  const handleBuy = async () => {
    if (!address || !subject || !amount) return;
    const value = parseEther(amount);
    buyShares({
      address: POL_TECH_CONTRACT_ADDRESS,
      abi: polTechABI.abi,
      functionName: "buyShares",
      args: [subject as `0x${string}`],
      value,
    });
  };

  const handleSell = async () => {
    if (!address || !subject || !amount) return;
    sellShares({
      address: POL_TECH_CONTRACT_ADDRESS,
      abi: polTechABI.abi,
      functionName: "sellShares",
      args: [subject as `0x${string}`, BigInt(amount)],
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wallet</h1>
      <Card>
        <CardHeader>
          <CardTitle>Trade Keys for {subject}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Your Balance:{" "}
            {sharesBalance ? sharesBalance.toString() : "Loading..."} keys
          </p>
          <p>
            Current Price:{" "}
            {sharePrice
              ? parseFloat(sharePrice.toString()) / 1e18
              : "Loading..."}{" "}
            BERA
          </p>
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2"
          />
          <div className="flex space-x-2 mt-2">
            <Button onClick={handleBuy} disabled={isBuying}>
              Buy Keys
            </Button>
            <Button onClick={handleSell} disabled={isSelling}>
              Sell Keys
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
