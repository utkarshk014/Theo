"use client";
import { Command } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { IoSend } from "react-icons/io5";

interface GlowingTextInputProps {
  onSubmit?: (message: string) => void;
  disabled?: boolean;
}

const GlowingTextInput = ({
  onSubmit,
  disabled = false,
}: GlowingTextInputProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState("");
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => !isExpanded && setHovered(false);

  const handleClick = () => {
    if (disabled) return;
    setIsExpanded(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;

    if (onSubmit) {
      onSubmit(value.trim());
    }
    setValue("");
    setIsExpanded(false);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "24px";
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "0";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 300)}px`; // Max height of 300px
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustTextareaHeight();
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  const handleBlur = () => {
    if (!value.trim()) {
      setIsExpanded(false);
      setHovered(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Check for Command/Control + K
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        if (!disabled) {
          setIsExpanded(true);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [disabled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !value.trim()
      ) {
        setIsExpanded(false);
        setHovered(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const getOverflowStyle = () => {
    const scrollHeight = inputRef.current?.scrollHeight;
    return {
      overflowY: scrollHeight && scrollHeight > 300 ? "auto" : "hidden",
    } as const;
  };

  return (
    <div className="fixed bottom-10 w-full flex justify-center">
      <div
        className={twMerge(
          "cursor-pointer relative rounded-[10px] bg-primaryCard border border-primaryCardBorder transition-all duration-300 ease-in-out",
          isExpanded ? "w-[600px]" : "w-[180px] h-[40px]",
          "p-2 flex items-center origin-center",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >

        {!isExpanded && (
          <div
            className={twMerge(
              "border-l-2 w-[10px] h-[22px] transition-all duration-500",
              hovered
                ? "border-l-emerald-500 animate-opacity-oscillate"
                : "border-l-gray-400 animate-opacity-oscillate"
            )}
          />
        )}

        {!isExpanded ? (
          <div className="flex gap-1 items-center text-gray-400 ml-auto mr-2">
            <Command size={16} />
            <p>K</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full p-2">
            <textarea
              ref={inputRef}
              value={value}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              rows={1}
              className={twMerge(
                "bg-transparent text-gray-200 outline-none w-full min-h-[24px] max-h-[300px]",
                "overflow-y-auto resize-none placeholder-gray-400",
                "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent",
                disabled && "cursor-not-allowed"
              )}
              placeholder="Type a message..."
              onBlur={handleBlur}
              style={getOverflowStyle()}
            />
            <div className="flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit();
                }}
                disabled={disabled || !value.trim()}
                className={twMerge(
                  "text-emerald-500 hover:text-emerald-400 transition-colors",
                  "disabled:text-gray-500 disabled:cursor-not-allowed"
                )}
              >
                <IoSend size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlowingTextInput;
