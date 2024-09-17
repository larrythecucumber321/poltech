import { useReadContract } from "wagmi";
import polTechABI from "@/lib/abi/polTech.json";

export const POLTECH_CONTRACT_ADDRESS =
  "0xc00A733cF559b1311d956dA2BCEd7231901fD7Aa" as `0x${string}`;

export function useGetSharesBalance(
  user: `0x${string}`,
  subject: `0x${string}`
) {
  return useReadContract({
    address: POLTECH_CONTRACT_ADDRESS,
    abi: polTechABI.abi,
    functionName: "getSharesBalance",
    args: [user, subject],
  });
}

export function useGetSharePrice(subject: `0x${string}`) {
  return useReadContract({
    address: POLTECH_CONTRACT_ADDRESS,
    abi: polTechABI.abi,
    functionName: "getSharePrice",
    args: [subject],
  });
}

export const DEFAULT_SUBJECTS: `0x${string}`[] = [
  "0x2345678901234567890123456789012345678901",
  "0x3456789012345678901234567890123456789012",
  "0x4567890123456789012345678901234567890123",
  "0x5678901234567890123456789012345678901234",
];
