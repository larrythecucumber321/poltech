"use client";

import { useState } from "react";
import ChatList from "@/components/chat-list";
import ChatWindow from "@/components/chat-window";
import { DEFAULT_SUBJECTS } from "@/app/hooks/useShareTrading";

export default function ChatPage() {
  const [selectedSubject, setSelectedSubject] = useState<`0x${string}` | null>(
    null
  );

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 border-r">
        <h1 className="text-2xl font-bold mb-4">Chats</h1>
        <ChatList
          subjects={DEFAULT_SUBJECTS}
          onSelectSubject={setSelectedSubject}
        />
      </div>
      <div className="w-2/3 p-4">
        {selectedSubject ? (
          <ChatWindow subject={selectedSubject} />
        ) : (
          <p className="text-center text-gray-500">
            Select a chat to start messaging
          </p>
        )}
      </div>
    </div>
  );
}
