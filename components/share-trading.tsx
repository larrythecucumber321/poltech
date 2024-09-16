import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseEther } from "viem";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";

const POL_TECH_ADDRESS = "0x0000000000ffe8b47b3e2130213b802212439497";

const POL_TECH_ABI = [
  {
    type: "function",
    name: "buyShares",
    inputs: [{ name: "subject", type: "address" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "sellShares",
    inputs: [
      { name: "subject", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getSharesBalance",
    inputs: [
      { name: "user", type: "address" },
      { name: "subject", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
] as const;

export function ShareTrading() {
  const [subjectAddress, setSubjectAddress] = useState<`0x${string}`>(
    "0xf290f3d843826d00f8176182fd76550535f6dbb4"
  );
  const [amount, setAmount] = useState("");
  const account = useAccount();

  const { data: sharesBalance } = useReadContract({
    address: POL_TECH_ADDRESS,
    abi: POL_TECH_ABI,
    functionName: "getSharesBalance",
    args: [account.address ?? "0x0", subjectAddress],
  });

  const { writeContract } = useWriteContract();

  const handleBuy = () => {
    if (subjectAddress) {
      writeContract({
        address: POL_TECH_ADDRESS,
        abi: POL_TECH_ABI,
        functionName: "buyShares",
        args: [subjectAddress],
        value: parseEther(amount),
      });
    }
  };

  const handleSell = () => {
    if (subjectAddress && amount) {
      writeContract({
        address: POL_TECH_ADDRESS,
        abi: POL_TECH_ABI,
        functionName: "sellShares",
        args: [subjectAddress, parseEther(amount)],
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Shares</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Subject Address"
          value={subjectAddress}
          onChange={(e) => setSubjectAddress(e.target.value as `0x${string}`)}
        />
        <Input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={handleBuy}>Buy Shares</Button>
        <Button onClick={handleSell}>Sell Shares</Button>
        {sharesBalance && (
          <p>Your shares balance: {sharesBalance.toString()}</p>
        )}
      </CardContent>
    </Card>
  );
}
