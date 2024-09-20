"use client";
import { useAccount } from "wagmi";
import {
  DEFAULT_SUBJECTS,
  useGetSharePrice,
  useGetSharesBalance,
} from "@/app/hooks/useShareTrading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import ShareTradingModal from "@/components/share-trading-modal";

export default function Home() {
  const { address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<`0x${string}` | null>(
    null
  );

  const handleTradeClick = (subject: `0x${string}`) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary dark:text-primary-dark">
        Welcome to POLTech
      </h1>
      {address ? (
        <>
          <SubjectList
            title="Your Owned Shares"
            address={address}
            onTradeClick={handleTradeClick}
            showOwnedOnly
          />
          <SubjectList
            title="All Subjects"
            address={address}
            onTradeClick={handleTradeClick}
            showOwnedOnly={false}
          />
        </>
      ) : (
        <p className="text-lg text-foreground dark:text-foreground-dark">
          Please connect your wallet to view subjects and trade keys.
        </p>
      )}
      {isModalOpen && selectedSubject && (
        <ShareTradingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subject={selectedSubject}
        />
      )}
    </div>
  );
}

function SubjectList({
  title,
  address,
  onTradeClick,
  showOwnedOnly,
}: {
  title: string;
  address: `0x${string}`;
  onTradeClick: (subject: `0x${string}`) => void;
  showOwnedOnly: boolean;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-8 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEFAULT_SUBJECTS.map((subject) => (
          <SubjectCard
            key={subject}
            subject={subject}
            address={address}
            onTradeClick={onTradeClick}
            showOwnedOnly={showOwnedOnly}
          />
        ))}
      </div>
    </div>
  );
}

function SubjectCard({
  subject,
  address,
  onTradeClick,
  showOwnedOnly,
}: {
  subject: `0x${string}`;
  address: `0x${string}`;
  onTradeClick: (subject: `0x${string}`) => void;
  showOwnedOnly: boolean;
}) {
  const { data: sharePrice } = useGetSharePrice(subject);
  const { data: sharesBalance } = useGetSharesBalance(address, subject);

  if (
    (showOwnedOnly &&
      (!sharesBalance || (sharesBalance as bigint) == BigInt(0))) ||
    (!showOwnedOnly && sharesBalance)
  ) {
    return null;
  }

  return (
    <Card className="border-2 border-border dark:border-border-dark">
      <CardHeader className="bg-secondary dark:bg-secondary-dark">
        <CardTitle className="text-xl text-foreground dark:text-foreground-dark">
          Subject: {subject.slice(0, 6)}...{subject.slice(-4)}
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        {sharesBalance !== undefined && (sharesBalance as bigint) > 0 && (
          <p className="text-lg text-foreground dark:text-foreground-dark mb-2">
            Your Shares: {(sharesBalance as bigint).toString()}
          </p>
        )}
        <p className="text-lg text-foreground dark:text-foreground-dark mb-4">
          Share Price:{" "}
          <span className="font-semibold text-primary dark:text-primary-dark">
            {sharePrice
              ? parseFloat(sharePrice.toString()) / 1e18
              : "Loading..."}{" "}
            BERA
          </span>
        </p>
        <div className="flex space-x-2">
          <Button
            onClick={() => onTradeClick(subject)}
            className="flex-1 bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-background dark:text-background-dark font-semibold"
          >
            Trade Keys
          </Button>
          {showOwnedOnly && (
            <Link href={`/chat/${subject}`} passHref>
              <Button className="flex-1 bg-secondary hover:bg-secondary-light dark:bg-secondary-dark dark:hover:bg-secondary text-foreground dark:text-foreground-dark font-semibold">
                Chat
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
