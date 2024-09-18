import { useGetSharePrice } from "@/app/hooks/useShareTrading";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ChatListProps = {
  subjects: `0x${string}`[];
  selectedSubject?: `0x${string}`;
};

export default function ChatList({ subjects, selectedSubject }: ChatListProps) {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <ChatItem
          key={subject}
          subject={subject}
          isSelected={subject === selectedSubject}
        />
      ))}
    </div>
  );
}

function ChatItem({
  subject,
  isSelected,
}: {
  subject: `0x${string}`;
  isSelected: boolean;
}) {
  const { data: sharePrice } = useGetSharePrice(subject);

  return (
    <Link href={`/chat/${subject}`}>
      <div
        className={cn(
          "flex items-center p-4 border-2 border-border dark:border-border-dark rounded-lg cursor-pointer transition-colors duration-200",
          isSelected
            ? "bg-secondary dark:bg-secondary-dark"
            : "hover:bg-secondary dark:hover:bg-secondary-dark"
        )}
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-2">
            Subject: {subject.slice(0, 6)}...{subject.slice(-4)}
          </h3>
          <p className="text-base text-primary dark:text-primary-dark">
            Share Price:{" "}
            <span className="font-medium">
              {sharePrice
                ? `${(parseFloat(sharePrice.toString()) / 1e18).toFixed(
                    4
                  )} BERA`
                : "Loading..."}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
