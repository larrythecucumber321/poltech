"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { supabase } from "@/lib/supabase";
import { useGetSharesBalance } from "@/app/hooks/useShareTrading";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: sharesBalance } = useGetSharesBalance(address || "0x", subject);
  useEffect(() => {
    if (sharesBalance && sharesBalance >= 1n) {
      fetchOrCreateChatRoom(subject);
    }
  }, [subject, sharesBalance]);

  useEffect(() => {
    if (chatRoomId) {
      fetchMessages(chatRoomId);
      const subscription = subscribeToNewMessages(chatRoomId);
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [chatRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const fetchOrCreateChatRoom = async (subject: `0x${string}`) => {
    // Fetch all chat rooms
    let { data: chatRooms, error } = await supabase
      .from("chat_rooms")
      .select("*")
      .ilike("subject", `%${subject}%`);

    if (error) {
      console.error("Error fetching chat rooms:", error);
      return;
    }

    let chatRoom = chatRooms?.find(
      (room) => room.subject.toLowerCase() === subject.toLowerCase()
    );

    if (!chatRoom) {
      console.log("Creating new chat room for subject:", subject);
      const { data: newChatRoom, error: insertError } = await supabase
        .from("chat_rooms")
        .insert({ subject: subject.toLowerCase() })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating chat room:", insertError);
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
    return supabase
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
  };

  const sendMessage = async () => {
    if (!address || !newMessage.trim() || !chatRoomId) return;
    const { error } = await supabase.from("messages").insert({
      chat_room_id: chatRoomId,
      sender: address.toLowerCase(),
      content: newMessage.trim(),
    });

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    setNewMessage("");
  };

  if (!sharesBalance || sharesBalance === 0n) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">
          You need to own at least one share to access this chat.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold p-4 bg-gray-200 rounded-t-lg">
        Chat with {subject.slice(0, 6)}...{subject.slice(-4)}
      </h2>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 flex ${
              message.sender === address ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.sender === address
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              <p className="font-semibold text-sm">
                {message.sender.slice(0, 6)}...{message.sender.slice(-4)}
              </p>
              <p className="break-words">{message.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {new Date(message.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex p-4 bg-gray-200 rounded-b-lg">
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
