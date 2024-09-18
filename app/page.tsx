"use client";
import { useAccount } from "wagmi";
import {
  DEFAULT_SUBJECTS,
  useGetSharePrice,
} from "@/app/hooks/useShareTrading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { address } = useAccount();

  return (
    <div className="container mx-auto p-4 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary dark:text-primary-dark">
        Welcome to POLTech
      </h1>
      {address ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_SUBJECTS.map((subject) => (
            <SubjectCard key={subject} subject={subject} />
          ))}
        </div>
      ) : (
        <p className="text-lg text-foreground dark:text-foreground-dark">
          Please connect your wallet to view subjects and trade keys.
        </p>
      )}
    </div>
  );
}

function SubjectCard({ subject }: { subject: `0x${string}` }) {
  const { data: sharePrice } = useGetSharePrice(subject);

  return (
    <Card className="border-2 border-border dark:border-border-dark">
      <CardHeader className="bg-secondary dark:bg-secondary-dark">
        <CardTitle className="text-xl text-foreground dark:text-foreground-dark">
          Subject: {subject.slice(0, 6)}...{subject.slice(-4)}
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <p className="text-lg text-foreground dark:text-foreground-dark mb-4">
          Share Price:{" "}
          <span className="font-semibold text-primary dark:text-primary-dark">
            {sharePrice
              ? parseFloat(sharePrice.toString()) / 1e18
              : "Loading..."}{" "}
            BERA
          </span>
        </p>
        <Link href={`/wallet?subject=${subject}`}>
          <Button className="w-full bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-background dark:text-background-dark font-semibold">
            Trade Keys
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
