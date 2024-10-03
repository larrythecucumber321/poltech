import { useReadContract } from "wagmi";
import polTechABI from "@/lib/abi/POLTech.json";
import { POLTECH_CONTRACT_ADDRESS } from "@/lib/constants";

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
  "0x6789012345678901234567890123456789012345",
  "0x7890123456789012345678901234567890123456",
  "0x8901234567890123456789012345678901234567",
  "0x9012345678901234567890123456789012345678",
  "0xa123456789012345678901234567890123456789",
  "0xb234567890123456789012345678901234567890",
];
