"use client";
import { Command } from "lucide-react";
import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const GlowTextInputSignedOut = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => !isExpanded && setHovered(false);

  const handleClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      setShowContent(true);
    }, 250);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsExpanded(true);
        setTimeout(() => {
          setShowContent(true);
        }, 250);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className="fixed bottom-10 right-[-8%] w-full flex justify-center">
      <motion.div
        className={twMerge(
          "cursor-pointer relative rounded-[10px] bg-primaryCard border border-primaryCardBorder",
          isExpanded ? "w-[600px]" : "w-[180px] h-[40px]",
          "p-2 flex items-center origin-center"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        animate={{
          width: isExpanded ? 600 : 180,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={twMerge(
                "border-l-2 w-[10px] h-[22px] transition-all duration-500",
                hovered
                  ? "border-l-emerald-500 animate-opacity-oscillate"
                  : "border-l-gray-400 animate-opacity-oscillate"
              )}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-1 items-center text-gray-400 ml-auto mr-2"
            >
              <Command size={16} />
              <p>K</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-between items-center gap-2 w-full p-2"
            >
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Please SignIn / SignUp to start talking to me 😉
              </motion.p>
              <SignedOut>
                <SignInButton>
                  <motion.button
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[10px] text-black px-5 py-2.5"
                  >
                    Sign up / Sign in
                  </motion.button>
                </SignInButton>
              </SignedOut>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GlowTextInputSignedOut;
