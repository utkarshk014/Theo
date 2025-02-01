"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TheoBrainLogo, TheoBrainLogoThinkingSmall } from "./Theo";
import { CheckCircle2, Circle } from "lucide-react";
import GlowingTextInput from "./GlowingInput";
import {
  Chapter,
  Progress,
  Message as APIMessage,
  Subtopic,
} from "@/app/lib/api";
import { FormattedAIResponse } from "./FormattedAiResponse";

// Interfaces
interface Message extends APIMessage {
  isTyping?: boolean;
}

interface TypewriterTextProps {
  content: string;
  onComplete: () => void;
}

interface LearningAreaProps {
  chapter: Chapter;
  progress: Progress;
  onProgressUpdate: (understood: boolean) => void;
}

// Helper Components
const TypewriterText = ({ content, onComplete }: TypewriterTextProps) => {
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

const AIMessage = ({
  content,
  isTyping,
  onTypingComplete,
}: {
  content: string;
  isTyping: boolean;
  onTypingComplete?: () => void;
}) => {
  const [status, setStatus] = useState<"typing" | "formatting" | "formatted">(
    isTyping ? "typing" : "formatted"
  );
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (isTyping) {
      setStatus("typing");
      hasCompletedRef.current = false;
    } else {
      setStatus("formatted");
    }
  }, [content, isTyping]);

  const handleTypingComplete = () => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setStatus("formatting");
      setTimeout(() => {
        setStatus("formatted");
        onTypingComplete?.();
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-4 w-full"
    >
      <div className="flex items-start gap-5 w-full">
        {content.length !== 0 && <TheoBrainLogo />}
        <div className="max-w-[80%] text-base/8 p-2 rounded-lg text-text-primary">
          {status === "typing" ? (
            <TypewriterText
              content={content}
              onComplete={handleTypingComplete}
            />
          ) : status === "formatting" ? (
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
          ) : (
            <FormattedAIResponse content={content} />
          )}
        </div>
      </div>
    </motion.div>
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

const UpdatingProgressIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="flex items-start gap-5 mb-4"
  >
    <TheoBrainLogoThinkingSmall />
    <div className="flex gap-2 items-center text-gray-400">
      <span>Marking as complete</span>
      <motion.span
        animate={{
          opacity: [1, 0.5, 1],
          transition: { duration: 3, repeat: Infinity },
        }}
      >
        ...
      </motion.span>
    </div>
  </motion.div>
);

// const TopicProgress = ({
//   topics,
//   currentSubtopicId,
//   completedSubtopicIds,
//   onTopicSelect,
// }: {
//   topics: Subtopic[];
//   currentSubtopicId: number;
//   completedSubtopicIds: number[];
//   onTopicSelect: (subtopicId: number) => void;
// }) => (
//   <div className="sticky top-4 self-start w-64 bg-black/50 p-4 rounded-lg border border-gray-800">
//     <h3 className="text-white font-medium mb-2">Your Progress</h3>
//     <div className="mt-4 border-b border-gray-800 pb-4">
//       <div className="text-sm text-gray-400 mb-2">
//         Progress:{" "}
//         {Math.round((completedSubtopicIds.length / topics.length) * 100)}%
//       </div>
//       <div className="w-full bg-gray-700 rounded-full h-2">
//         <motion.div
//           className="bg-emerald-500 h-2 rounded-full"
//           initial={{ width: 0 }}
//           animate={{
//             width: `${(completedSubtopicIds.length / topics.length) * 100}%`,
//           }}
//           transition={{ duration: 0.5 }}
//         />
//       </div>
//     </div>
//     <div className="flex flex-col gap-3 mt-5">
//       {topics.map((topic) => (
//         <button
//           key={topic.id}
//           onClick={() => onTopicSelect(topic.id)}
//           className={`flex items-center gap-3 text-left transition-colors ${
//             topic.id === currentSubtopicId
//               ? "text-emerald-400"
//               : completedSubtopicIds.includes(topic.id)
//               ? "text-gray-300 hover:text-emerald-400"
//               : "text-gray-500 cursor-not-allowed"
//           }`}
//         >
//           {completedSubtopicIds.includes(topic.id) ? (
//             <CheckCircle2 className="w-4 h-4 shrink-0" />
//           ) : (
//             <Circle className="w-4 h-4 shrink-0" />
//           )}
//           <span className="text-sm">{topic.title}</span>
//         </button>
//       ))}
//     </div>
//   </div>
// );

const TopicProgress = ({
  topics,
  currentSubtopicId,
  completedSubtopicIds,
  onTopicSelect,
}: {
  topics: Subtopic[];
  currentSubtopicId: number;
  completedSubtopicIds: number[];
  onTopicSelect: (subtopicId: number) => void;
}) => {
  const totalProgress = Math.min(completedSubtopicIds.length * 10, 100); // Ensure max 100%

  return (
    <div className="sticky top-4 self-start w-64 bg-black/50 p-4 rounded-lg border border-gray-800">
      <h3 className="text-white font-medium mb-2">Your Progress</h3>
      <div className="mt-4 border-b border-gray-800 pb-4">
        <div className="text-sm text-gray-400 mb-2">
          Progress: {totalProgress}%
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-emerald-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-5">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicSelect(topic.id)}
            className={`flex items-center gap-3 text-left transition-colors ${
              topic.id === currentSubtopicId
                ? "text-emerald-400"
                : completedSubtopicIds.includes(topic.id)
                ? "text-gray-300 hover:text-emerald-400"
                : "text-gray-500 cursor-not-allowed"
            }`}
          >
            {completedSubtopicIds.includes(topic.id) ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 shrink-0" />
            )}
            <span className="text-sm">{topic.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const UnderstandingPrompt = ({
  onResponse,
}: {
  onResponse: (understood: boolean) => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
  >
    <p className="text-gray-300">Did you understand this topic?</p>
    <div className="flex gap-4">
      <button
        onClick={() => onResponse(true)}
        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
      >
        Yes, I understand
      </button>
      <button
        onClick={() => onResponse(false)}
        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        I need help
      </button>
    </div>
  </motion.div>
);

// Main Component
export const LearningArea = ({
  chapter,
  progress,
  onProgressUpdate,
}: LearningAreaProps) => {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTypingContent, setIsTypingContent] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showUnderstanding, setShowUnderstanding] = useState(false);

  // References
  const contentRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    setIsTypingContent(true);
    setMessages([]);
    setShowQuestion(false);
    setShowUnderstanding(false);
    setIsThinking(false);
  }, [progress.current_progress.subtopic_id]);

  // Auto-scroll when new content is added
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showQuestion]);

  // Handlers
  const handleContentTypingComplete = () => {
    setIsTypingContent(false);
    setShowUnderstanding(true);
  };

  // const handleUnderstanding = (understood: boolean) => {
  //   setShowUnderstanding(false);
  //   if (understood) {
  //     onProgressUpdate(true);
  //   } else {
  //     setShowQuestion(true);
  //   }
  // };

  // const handleUnderstanding = (understood: boolean) => {
  //   setShowUnderstanding(false); // Hide the dialog immediately
  //   setShowQuestion(false); // Close input if it's open

  //   if (understood) {
  //     onProgressUpdate(true); // ✅ Ensure progress updates correctly
  //   } else {
  //     setShowQuestion(true); // ❌ Do NOT open input immediately
  //   }
  // };

  const handleUnderstanding = (understood: boolean) => {
    setShowUnderstanding(false); // Hide the dialog immediately
    setShowQuestion(false); // Close input if it's open
    setIsThinking(true); // Show "Updating progress..."

    if (understood) {
      setTimeout(() => {
        onProgressUpdate(true); // ✅ Update progress
        setIsThinking(false); // Hide feedback once topic updates
      }, 1500); // Delay to simulate processing
    } else {
      setTimeout(() => {
        setShowQuestion(true); // Show input box again
        setIsThinking(false);
      }, 1500);
    }
  };

  const handleNewMessage = async (content: string) => {
    setIsThinking(true);
    setShowQuestion(false); // ❌ Close input box immediately
    setShowUnderstanding(false); // ❌ Hide "Did you understand?" until AI responds

    const newMessage: Message = {
      user: content,
      ai: "",
      userTokens: 0,
      aiTokens: 0,
      createdAt: new Date().toISOString(),
      isTyping: true, // AI starts typing
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const aiResponse: Message = {
        user: content,
        ai:
          "Let me help explain this better. " +
          chapter.subtopics.find(
            (st) => st.id === progress.current_progress.subtopic_id
          )?.content,
        userTokens: 0,
        aiTokens: 0,
        createdAt: new Date().toISOString(),
        isTyping: true, // Typewriter animation starts
      };

      setMessages((prev) => [...prev.slice(0, -1), aiResponse]);

      // ✅ Wait for AI response to finish formatting before showing "Did you understand?"
      setTimeout(() => {
        setShowUnderstanding(true);
      }, 1000); // Small delay after formatting
    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  const renderContent = () => {
    return chapter.subtopics.map((subtopic) => {
      const isCompleted =
        progress.completion_status.completed_subtopics.includes(subtopic.id);
      const isCurrent = subtopic.id === progress.current_progress.subtopic_id;

      if (!isCompleted && !isCurrent) return null;

      return (
        <div key={subtopic.id} className="mb-10">
          <h2 className="text-xl font-semibold text-emerald-400 mb-6">
            {subtopic.title}
          </h2>
          <div className="space-y-6">
            <AIMessage
              content={subtopic.content}
              isTyping={isCurrent && isTypingContent}
              onTypingComplete={
                isCurrent ? handleContentTypingComplete : undefined
              }
            />
            {isCurrent &&
              messages.map((message, index) => (
                <React.Fragment key={index}>
                  <UserMessage content={message.user} />
                  <AIMessage
                    content={message.ai}
                    isTyping={Boolean(message.isTyping)}
                    onTypingComplete={() => {
                      if (message.isTyping) {
                        setMessages((prev) =>
                          prev.map((m, i) =>
                            i === index ? { ...m, isTyping: false } : m
                          )
                        );
                      }
                    }}
                  />
                </React.Fragment>
              ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex gap-8 max-w-7xl mx-auto px-4 py-12">
      <div className="flex-1 relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            {chapter.title}
          </h1>
          {renderContent()}
          <div ref={contentRef} />
        </motion.div>

        <AnimatePresence>
          {isThinking && <UpdatingProgressIndicator />}
          {showUnderstanding && !showQuestion && !isThinking && (
            <UnderstandingPrompt onResponse={handleUnderstanding} />
          )}
        </AnimatePresence>

        {showQuestion && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[600px]">
            <GlowingTextInput
              onSubmit={handleNewMessage}
              disabled={isThinking}
            />
          </div>
        )}
      </div>

      <TopicProgress
        topics={chapter.subtopics}
        currentSubtopicId={progress.current_progress.subtopic_id}
        completedSubtopicIds={progress.completion_status.completed_subtopics}
        onTopicSelect={() => {}}
      />
    </div>
  );
};
