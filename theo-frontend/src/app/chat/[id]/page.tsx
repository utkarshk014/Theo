"use client";

import { useCallback, useEffect, useState } from "react";
import ChatArea from "@/components/ChatArea";
import { useParams } from "next/navigation";
import { useNotification } from "@/app/hooks/useNotifications";
import GlowingTextInput from "@/components/GlowingInput";
import { useApi } from "@/app/hooks/useApi";
import { Message } from "@/app/lib/api";
import { Spinner } from "@/components/Spinner";

export default function ChatPage() {
  const params = useParams();
  const api = useApi();
  const { addNotification } = useNotification();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  //   const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoadingComplete, setIsLoadingComplete] = useState(true);

  const fetchConversation = useCallback(() => {
    (async () => {
      if (!params.id) return;

      try {
        setIsLoading(true);
        const response = await api.getConversation(Number(params.id));

        if (response.error) {
          console.log(response.error);
          addNotification(
            "error",
            "Failed to load conversation",
            "conversation"
          );
          return;
        }

        if (response.data) {
          //   setConversation(response.data);
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error(error);
        addNotification("error", "Failed to load conversation", "conversation");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params.id, addNotification, api]);


const sendMessage = async (content: string) => {
    try {
      setIsThinking(true);
      setIsLoadingComplete(false);
  
      // Immediately add user message with empty AI response
      const tempMessage: Message = {
        user: content,
        ai: "",  // Empty AI response initially
        userTokens: 0,  // We'll update this later
        aiTokens: 0,    // We'll update this later
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMessage]);
  
      const response = await api.createMessage(content, Number(params.id));
  
      if (response.error) {
        addNotification("error", "Failed to send message", "message");
        // Remove the temporary message if API call fails
        setMessages(prev => prev.slice(0, -1));
        return;
      }
  
      if (response.data) {
        // Replace the temporary message with the complete message from API
        const newMessage = response.data.messages[0];
        setMessages(prev => [...prev.slice(0, -1), newMessage]);
      }
    } catch (error) {
      console.log(error);
      addNotification("error", "Failed to send message", "message");
      // Remove the temporary message if there's an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsThinking(false);
      setIsLoadingComplete(true);
    }
  };


  useEffect(() => {
    fetchConversation();
  }, [params.id, fetchConversation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center h-[80vh]">
      <ChatArea
        messages={messages}
        isLoadingComplete={isLoadingComplete}
        isThinking={isThinking}
      />

      {/* Input area - You might want to create a separate component for this */}
      <GlowingTextInput onSubmit={sendMessage} disabled={isThinking} />
    </div>
  );
}
