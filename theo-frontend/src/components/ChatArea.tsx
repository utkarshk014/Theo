import React, { useEffect, useRef, useState } from "react";
import { TheoBrainLogo, TheoBrainLogoThinkingSmall } from "./Theo";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "@/app/lib/api";
import { FormattedAIResponse } from "./FormattedAiResponse";

interface ChatAreaProps {
  messages: Message[];
  isLoadingComplete: boolean;
  isThinking?: boolean;
}

const TypewriterText = ({
  content,
  onComplete,
}: {
  content: string;
  onComplete: () => void;
}) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getDelay = (currentChar: string) => {
    if ([".", "!", "?"].includes(currentChar)) return 600;
    if ([",", ";", ":"].includes(currentChar)) return 300;
    return 30;
  };

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedContent("");

    const typeChar = () => {
      if (indexRef.current < content.length) {
        const currentChar = content[indexRef.current];
        setDisplayedContent((prev) => prev + currentChar);
        indexRef.current++;

        if (indexRef.current < content.length) {
          timeoutRef.current = setTimeout(typeChar, getDelay(currentChar));
        } else {
          setTimeout(onComplete, 500);
        }
      }
    };

    timeoutRef.current = setTimeout(typeChar, 10);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [content, onComplete]);

  return (
    <div>
      {displayedContent}
      {displayedContent.length < content.length && (
        <span className="inline-block w-0.5 h-4 ml-1 bg-white animate-pulse" />
      )}
    </div>
  );
};

const UserMessage = ({ content }: { content: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-end mb-4 w-full"
  >
    <div className="max-w-[80%] bg-primaryCard p-3 rounded-[20px] text-text-primary border border-primaryCardBorder">
      {content}
    </div>
  </motion.div>
);

const AIMessage = ({
  content,
  isStreaming,
  isLatestAIMessage,
}: {
  content: string;
  isStreaming: boolean;
  isLatestAIMessage: boolean;
}) => {
  const [isTyping, setIsTyping] = useState(isStreaming && isLatestAIMessage);
  const [isFormatting, setIsFormatting] = useState(false);
  const [showFormatted, setShowFormatted] = useState(true);

  const handleTypingComplete = () => {
    setIsTyping(false);
    setIsFormatting(true);
    setTimeout(() => {
      setIsFormatting(false);
      setShowFormatted(true);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-4 w-full"
    >
      <div className="flex items-start gap-5 w-full">
        {content.length != 0 && <TheoBrainLogo />}
        <div className="max-w-[80%] text-base/8 p-2 rounded-lg text-text-primary">
          {isTyping ? (
            <TypewriterText
              content={content}
              onComplete={handleTypingComplete}
            />
          ) : isFormatting ? (
            <div className="flex gap-2 items-center text-gray-400">
              <span>Formatting</span>
              <motion.span
                animate={{
                  opacity: [1, 0.5, 1],
                  transition: { duration: 1, repeat: Infinity },
                }}
              >
                ...
              </motion.span>
            </div>
          ) : showFormatted ? (
            <FormattedAIResponse content={content} />
          ) : (
            content
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ThinkingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="flex items-start gap-5 mb-4"
  >
    <TheoBrainLogoThinkingSmall />
    <div className="flex gap-2 items-center text-gray-400">
      <span>Thinking</span>
      <motion.span
        animate={{
          opacity: [1, 0.5, 1],
          transition: { duration: 1.5, repeat: Infinity },
        }}
      >
        ...
      </motion.span>
    </div>
  </motion.div>
);

const ChatArea = ({
  messages,
  isLoadingComplete,
  isThinking = false,
}: ChatAreaProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [streamingEnabled, setStreamingEnabled] = useState(false);

  // Sort messages by createdAt timestamp
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const isLatestMessage = (index: number) =>
    index === sortedMessages.length - 1;

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking]);

  useEffect(() => {
    if (!isLoadingComplete && messages.length > 0) {
      setStreamingEnabled(true);
    }
  }, [messages, isLoadingComplete]);

  return (
    <div className="relative h-full overflow-y-auto px-4 py-6 w-[80%] scrollbar-hide">
      <div className="flex flex-col space-y-10">
        {sortedMessages.map((message, index) => (
          <div key={message.createdAt}>
            <UserMessage content={message.user} />
            <AIMessage
              content={message.ai}
              isStreaming={streamingEnabled}
              isLatestAIMessage={isLatestMessage(index)}
            />
          </div>
        ))}
        <AnimatePresence>{isThinking && <ThinkingIndicator />}</AnimatePresence>
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatArea;
