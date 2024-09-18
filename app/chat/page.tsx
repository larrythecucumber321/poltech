"use client";

import ChatList from "@/components/chat-list";
import { DEFAULT_SUBJECTS } from "@/app/hooks/useShareTrading";

export default function ChatListPage() {
  return (
    <div className="h-[calc(100vh-64px)] bg-background dark:bg-background-dark p-4">
      <h1 className="text-2xl font-bold mb-4 text-foreground dark:text-foreground-dark">
        Chats
      </h1>
      <ChatList subjects={DEFAULT_SUBJECTS} />
    </div>
  );
}
