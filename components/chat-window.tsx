"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useGetSharesBalance } from "@/app/hooks/useShareTrading";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  sender: string;
  content: string;
  created_at: string;
};

type ChatWindowProps = {
  subject: `0x${string}`;
  onTradeClick: () => void;
};

export default function ChatWindow({ subject, onTradeClick }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const { address } = useAccount();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: sharesBalance } = useGetSharesBalance(address || "0x", subject);
  useEffect(() => {
    if (sharesBalance && sharesBalance > 0n) {
      fetchOrCreateChatRoom(subject);
    }
  }, [subject, sharesBalance]);

  useEffect(() => {
    if (chatRoomId) {
      fetchMessages(chatRoomId);
      const subscription = subscribeToNewMessages(chatRoomId);
      const pollInterval = setInterval(() => fetchMessages(chatRoomId), 5000); // Poll every 5 seconds

      return () => {
        subscription.unsubscribe();
        clearInterval(pollInterval);
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
    const { data: chatRooms, error } = await supabase
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
    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_room_id: chatRoomId,
        sender: address.toLowerCase(),
        content: newMessage.trim(),
      })
      .select();

    if (error) {
      console.error("Error sending message:", error);
      return;
    }

    if (data) {
      setMessages((prevMessages) => [...prevMessages, data[0] as Message]);
      setNewMessage("");
    }
  };

  const SharesCount = () => (
    <span className="text-sm bg-accent dark:bg-accent-dark text-background dark:text-background-dark px-2 py-1 rounded-full">
      {sharesBalance?.toString() || "0"} shares
    </span>
  );

  const TradeKeyButton = ({ noKeys }: { noKeys: boolean }) => (
    <Button
      onClick={onTradeClick}
      className={cn(
        "text-sm",
        noKeys
          ? "bg-accent hover:bg-accent-dark text-background dark:text-background-dark"
          : "bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-foreground dark:text-foreground-dark"
      )}
    >
      Trade Key
    </Button>
  );

  if (!sharesBalance || sharesBalance === 0n) {
    return (
      <div className="flex items-center justify-center flex-col h-full bg-background dark:bg-background-dark rounded-lg shadow-md border border-border dark:border-border-dark">
        <h2 className="text-xl font-bold p-4 text-foreground dark:text-foreground-dark rounded-t-lg flex justify-between items-center">
          <span>
            Chat with {subject.slice(0, 6)}...{subject.slice(-4)}
          </span>
        </h2>
        <p className="text-lg text-foreground dark:text-foreground-dark mb-4">
          You need to own at least one share to access this chat.
        </p>
        <SharesCount />
        <div className="mt-4">
          <TradeKeyButton subject={subject} noKeys={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background dark:bg-background-dark rounded-lg shadow-md border border-border dark:border-border-dark">
      <h2 className="text-xl font-bold p-4 bg-primary text-foreground dark:text-foreground-dark rounded-t-lg flex justify-between items-center">
        <span>
          Chat with {subject.slice(0, 6)}...{subject.slice(-4)}
        </span>
        <div className="flex items-center space-x-2">
          <SharesCount />
          <TradeKeyButton subject={subject} noKeys={false} />
        </div>
      </h2>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender.toLowerCase() === address?.toLowerCase()
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-lg px-4 py-2",
                message.sender.toLowerCase() === address?.toLowerCase()
                  ? "bg-primary-light dark:bg-primary-dark text-foreground dark:text-foreground"
                  : "bg-secondary dark:bg-secondary-dark text-foreground dark:text-foreground-dark"
              )}
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
      <div className="flex p-4 bg-border dark:bg-border-dark rounded-b-lg">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 mr-2 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark border-primary dark:border-primary-dark"
        />
        <Button
          onClick={sendMessage}
          className="bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-foreground dark:text-foreground-dark"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
