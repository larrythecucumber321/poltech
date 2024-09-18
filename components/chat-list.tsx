import { useGetSharePrice } from "@/app/hooks/useShareTrading";

type ChatListProps = {
  subjects: `0x${string}`[];
  onSelectSubject: (subject: `0x${string}`) => void;
};

export default function ChatList({ subjects, onSelectSubject }: ChatListProps) {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <ChatItem key={subject} subject={subject} onSelect={onSelectSubject} />
      ))}
    </div>
  );
}

function ChatItem({
  subject,
  onSelect,
}: {
  subject: `0x${string}`;
  onSelect: (subject: `0x${string}`) => void;
}) {
  const { data: sharePrice } = useGetSharePrice(subject);

  return (
    <div
      className="flex items-center p-4 border-2 border-border dark:border-border-dark rounded-lg cursor-pointer hover:bg-secondary dark:hover:bg-secondary-dark transition-colors duration-200"
      onClick={() => onSelect(subject)}
    >
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-2">
          Subject: {subject.slice(0, 6)}...{subject.slice(-4)}
        </h3>
        <p className="text-base text-primary dark:text-primary-dark">
          Share Price:{" "}
          <span className="font-medium">
            {sharePrice
              ? parseFloat(sharePrice.toString()) / 1e18
              : "Loading..."}{" "}
            BERA
          </span>
        </p>
      </div>
    </div>
  );
}
