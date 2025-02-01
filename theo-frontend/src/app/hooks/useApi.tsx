"use client";
import { createContext, useContext, useMemo, ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Conversation,
  ConversationStatus,
  Chapter,
  Progress,
  ProgressUpdate,
  Doubt,
  ApiResponse,
  DoubtResponse,
} from "../lib/api";

const API_BASE_URL = "http://localhost:8000/api/v1";

interface ApiContextType {
  // Chat endpoints
  createMessage: (
    content: string,
    conversationId?: number
  ) => Promise<ApiResponse<Conversation>>;
  getConversation: (
    conversationId: number
  ) => Promise<ApiResponse<Conversation>>;
  getConversations: () => Promise<ApiResponse<ConversationStatus[]>>;
  createConversation: () => Promise<ApiResponse<Conversation>>;
  updateConversationTitle: (
    conversationId: number,
    title: string
  ) => Promise<ApiResponse<Conversation>>;

  // Chapter endpoints
  getChapters: () => Promise<ApiResponse<Chapter[]>>;
  getChapter: (chapterId: number) => Promise<ApiResponse<Chapter>>;

  // Progress endpoints
  getProgress: () => Promise<ApiResponse<Progress>>;
  updateProgress: (data: ProgressUpdate) => Promise<ApiResponse<Progress>>;
  moveToNext: () => Promise<ApiResponse<Progress>>;

  // Teaching endpoints
  askDoubt: (doubt: Doubt) => Promise<ApiResponse<DoubtResponse>>;
}

const ApiContext = createContext<ApiContextType | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();

  const api = useMemo(() => {
    const fetchWithAuth = async (
      endpoint: string,
      options: RequestInit = {}
    ) => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        return { data: await response.json() };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    };

    return {
      // Chat endpoints
      createMessage: (content: string, conversationId?: number) =>
        fetchWithAuth(
          "/chat/message" +
            (conversationId ? `?conversation_id=${conversationId}` : ""),
          {
            method: "POST",
            body: JSON.stringify({ content }),
          }
        ),

      getConversation: (conversationId: number) =>
        fetchWithAuth(`/chat/conversation/${conversationId}`),

      getConversations: () => fetchWithAuth("/chat/conversations"),

      createConversation: () =>
        fetchWithAuth("/chat/conversation/new", { method: "POST" }),

      updateConversationTitle: (conversationId: number, title: string) =>
        fetchWithAuth(`/chat/conversation/${conversationId}/title`, {
          method: "PATCH",
          body: JSON.stringify({ title }),
        }),

      // Chapter endpoints
      getChapters: () => fetchWithAuth("/chapters"),

      getChapter: (chapterId: number) =>
        fetchWithAuth(`/chapters/${chapterId}`),

      // Progress endpoints
      getProgress: () => fetchWithAuth("/progress"),

      updateProgress: (data: ProgressUpdate) =>
        fetchWithAuth("/progress/update", {
          method: "POST",
          body: JSON.stringify(data),
        }),

      moveToNext: () => fetchWithAuth("/progress/next", { method: "POST" }),

      // Teaching endpoints
      askDoubt: (doubt: Doubt) =>
        fetchWithAuth("/teaching/doubt", {
          method: "POST",
          body: JSON.stringify(doubt),
        }),
    };
  }, [getToken]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
