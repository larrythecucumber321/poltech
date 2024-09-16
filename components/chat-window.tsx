"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { supabase } from "@/lib/supabase";

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: number;
};

type ChatWindowProps = {
  subject: `0x${string}`;
};

export default function ChatWindow({ subject }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { address } = useAccount();

  useEffect(() => {
    // Fetch messages for the selected subject
    fetchMessages(subject);
  }, [subject]);

  const fetchMessages = async (subject: `0x${string}`) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("subject", subject)
      .order("timestamp", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!address || !newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      sender: address,
      content: newMessage.trim(),
      timestamp: Date.now(),
    };

    const { error } = await supabase
      .from("messages")
      .insert({ ...message, subject });

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">
        Chat with {subject.slice(0, 6)}...{subject.slice(-4)}
      </h2>
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 ${
              message.sender === address ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block bg-gray-200 rounded px-2 py-1">
              <p className="font-semibold">
                {message.sender.slice(0, 6)}...{message.sender.slice(-4)}
              </p>
              <p>{message.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 mr-2"
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
