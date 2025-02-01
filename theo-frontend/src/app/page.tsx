// "use client";
// // import { TheoLogo } from "@/components/Theo";
// import { useAuth, useUser } from "@clerk/nextjs";
// // import ExpertiseMode from "@/components/ExpertiseMode";
// // import Watchlist from "@/components/Watchlist";
// // import { TheoLogo } from "@/components/Theo";
// import { useEffect, useState } from "react";
// import GlowingTextInput from "@/components/GlowingInput";
// import { redirect } from "next/navigation";
// import { TheoBrainLogoThinking, TheoLogoBig } from "@/components/Theo";
// import PromptCards from "@/components/PromptCards";
// import ChatArea from "@/components/ChatArea";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Message } from "./lib/api";

// const LandingSkeleton = () => (
//   <div className="w-full p-6">
//     <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
//       {[1, 2, 3, 4].map((i) => (
//         <Skeleton
//           key={i}
//           className="h-40 bg-primaryCard border border-primaryCardBorder rounded-[10px]"
//         />
//       ))}
//     </div>
//   </div>
// );

// export default function Home() {
//   const { userId, getToken, isLoaded } = useAuth();
//   const { isSignedIn } = useUser();
//   const [messages, setMessages] = useState<Message[]>(msgs);
//   const [isThinking, setIsThinking] = useState(false);
//   const [isLoadingComplete, setIsLoadingComplete] = useState(true);

//   const handleNewMessage = async (content: string) => {
//     const userMessage: Message = { role: "user", content };
//     setMessages((prev) => [...prev, userMessage]);
//     setIsLoadingComplete(false);
//     setIsThinking(true);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 5000));

//       const mockResponse = {
//         message:
//           "Thank you for your message! I'm an AI assistant here to help you learn about finance and investing. I notice you mentioned about markets. While I don't make predictions, I can help you understand market fundamentals, risk management, and investment strategies. Would you like to explore any specific topic in more detail?",
//       };

//       setIsThinking(false);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: mockResponse.message,
//         },
//       ]);

//       setTimeout(() => {
//         setIsLoadingComplete(true);
//       }, mockResponse.message.length * 50 + 1000);
//     } catch (error) {
//       console.error("Error:", error);
//       setIsThinking(false);
//       setIsLoadingComplete(true);
//     }
//   };

//   useEffect(() => {
//     // Wait for auth to be loaded before making any decisions
//     if (!isLoaded) return;

//     // If user is not signed in, redirect to /theo
//     if (!isSignedIn) {
//       redirect("/theo");
//     }
//   }, [isLoaded, isSignedIn]);

//   return (
//     <main className="w-full flex flex-col items-center justify-center h-[80vh]">
//       <div className="text-center flex flex-col items-center gap-20">
//         <div className="z-10">
//           <div className="flex justify-center items-center gap-5">
//             <TheoLogoBig />
//             <TheoBrainLogoThinking />
//           </div>
//           <div className="text-base mt-5 font-normal text-gray-400">
//             Your personal AI finance and investment teacher. I Don&apos;t
//             Predict Markets. I Teach Mastery.
//           </div>
//         </div>
//         {!isLoaded ? <LandingSkeleton /> : <PromptCards />}
//       </div>

//       <ChatArea
//         messages={messages}
//         isLoadingComplete={isLoadingComplete}
//         isThinking={isThinking}
//       />

//       <GlowingTextInput onSubmit={handleNewMessage} />
//     </main>
//   );
// }

"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlowingTextInput from "@/components/GlowingInput";
import { redirect } from "next/navigation";
import { TheoBrainLogoThinking, TheoLogoBig } from "@/components/Theo";
import PromptCards from "@/components/PromptCards";
import ChatArea from "@/components/ChatArea";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "./lib/api";
import { useApi } from "@/app/hooks/useApi";
import { useNotification } from "@/app/hooks/useNotifications";

const LandingSkeleton = () => (
  <div className="w-full p-6">
    <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton
          key={i}
          className="h-40 bg-primaryCard border border-primaryCardBorder rounded-[10px]"
        />
      ))}
    </div>
  </div>
);

export default function Home() {
  const { isLoaded } = useAuth();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const api = useApi();
  const { addNotification } = useNotification();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingComplete, setIsLoadingComplete] = useState(true);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const handleNewMessage = async (content: string) => {
    try {
      setHasStartedChat(true);
      setIsThinking(true);
      setIsLoadingComplete(false);

      // Add temporary user message
      const tempMessage: Message = {
        user: content,
        ai: "",
        userTokens: 0,
        aiTokens: 0,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMessage]);

      // Create new conversation with first message
      const response = await api.createMessage(content);

      if (response.error) {
        addNotification("error", "Failed to send message", "message");
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      if (response.data) {
        const newMessage = response.data.messages[0];
        const newConversationId = response.data.conversation_id;

        // Update message and redirect to chat page
        setMessages((prev) => [...prev.slice(0, -1), newMessage]);
        router.push(`/chat/${newConversationId}`);
      }
    } catch (error) {
      console.error("Error:", error);
      addNotification("error", "Failed to send message", "message");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsThinking(false);
      setIsLoadingComplete(true);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      redirect("/theo");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <main className="w-full flex flex-col items-center justify-center h-[80vh]">
      {!hasStartedChat && (
        <div className="text-center flex flex-col items-center gap-20">
          <div className="z-10">
            <div className="flex justify-center items-center gap-5">
              <TheoLogoBig />
              <TheoBrainLogoThinking />
            </div>
            <div className="text-base mt-5 font-normal text-gray-400">
              Your personal AI finance and investment teacher. I Don&apos;t
              Predict Markets. I Teach Mastery.
            </div>
          </div>
          {!isLoaded ? <LandingSkeleton /> : <PromptCards />}
        </div>
      )}

      <ChatArea
        messages={messages}
        isLoadingComplete={isLoadingComplete}
        isThinking={isThinking}
      />

      <GlowingTextInput onSubmit={handleNewMessage} disabled={isThinking} />
    </main>
  );
}
