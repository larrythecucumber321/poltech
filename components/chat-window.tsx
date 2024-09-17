"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  sender: string;
  content: string;
  created_at: string;
};

type ChatWindowProps = {
  subject: `0x${string}`;
};

export default function ChatWindow({ subject }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    fetchOrCreateChatRoom(subject);
  }, [subject]);

  useEffect(() => {
    if (chatRoomId) {
      fetchMessages(chatRoomId);
      subscribeToNewMessages(chatRoomId);
    }
  }, [chatRoomId]);

  const fetchOrCreateChatRoom = async (subject: `0x${string}`) => {
    let { data: chatRoom } = await supabase
      .from("chat_rooms")
      .select("id")
      .eq("subject", subject)
      .single();

    if (!chatRoom) {
      const { data: newChatRoom, error } = await supabase
        .from("chat_rooms")
        .insert({ subject })
        .select()
        .single();

      if (error) {
        console.error("Error creating chat room:", error);
        return;
      }

      chatRoom = newChatRoom;
    }

    setChatRoomId(chatRoom?.id);
  };

  const fetchMessages = async (chatRoomId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_room_id", chatRoomId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    setMessages(data || []);
  };

  const subscribeToNewMessages = (chatRoomId: string) => {
    const subscription = supabase
      .channel(`chat_room:${chatRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            payload.new as Message,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  const sendMessage = async () => {
    if (!address || !newMessage.trim() || !chatRoomId) return;

    const { error } = await supabase.from("messages").insert({
      chat_room_id: chatRoomId,
      sender: address,
      content: newMessage.trim(),
    });

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

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
                {new Date(message.created_at).toLocaleString()}
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
