"use client";

import { useParams } from "next/navigation";
import ChatWindow from "@/components/chat-window";
import ChatList from "@/components/chat-list";
import { DEFAULT_SUBJECTS } from "@/app/hooks/useShareTrading";

export default function ChatPage() {
  const { subject } = useParams();

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background dark:bg-background-dark">
      <div className="w-1/3 p-4 overflow-y-auto border-r border-border dark:border-border-dark">
        <h1 className="text-2xl font-bold mb-4 text-foreground dark:text-foreground-dark">
          Chats
        </h1>
        <ChatList
          subjects={DEFAULT_SUBJECTS}
          selectedSubject={subject as `0x${string}`}
        />
      </div>
      <div className="w-2/3 p-4">
        {subject ? (
          <ChatWindow subject={subject as `0x${string}`} />
        ) : (
          <p className="text-center text-foreground dark:text-foreground-dark">
            Select a chat to start messaging
          </p>
        )}
      </div>
    </div>
  );
}
