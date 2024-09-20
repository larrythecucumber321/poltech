"use client";

import { useParams } from "next/navigation";
import ChatWindow from "@/components/chat-window";
import { useState } from "react";
import ShareTradingModal from "@/components/share-trading-modal";

export default function ChatPage() {
  const { subject } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-[calc(100vh-64px)] bg-background dark:bg-background-dark p-4">
      <ChatWindow
        subject={subject as `0x${string}`}
        onTradeClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && subject && (
        <ShareTradingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subject={subject as `0x${string}`}
        />
      )}
    </div>
  );
}
