import { useGetSharePrice } from "@/app/hooks/useShareTrading";

type ChatListProps = {
  subjects: `0x${string}`[];
  onSelectSubject: (subject: `0x${string}`) => void;
};

export default function ChatList({ subjects, onSelectSubject }: ChatListProps) {
  return (
    <div>
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
      className="flex items-center p-2 border-b cursor-pointer hover:bg-gray-100"
      onClick={() => onSelect(subject)}
    >
      <div className="flex-1">
        <h3 className="font-semibold">
          Subject: {subject.slice(0, 6)}...{subject.slice(-4)}
        </h3>
        <p className="text-sm text-gray-500">
          Share Price:{" "}
          {sharePrice ? parseFloat(sharePrice.toString()) / 1e18 : "Loading..."}{" "}
          BERA
        </p>
      </div>
    </div>
  );
}
