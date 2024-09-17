"use client";

import { useSearchParams } from "next/navigation";
import { ShareTrading } from "@/components/share-trading";

export default function WalletPage() {
  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") || "";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wallet</h1>
      <ShareTrading initialSubject={subject} />
    </div>
  );
}
