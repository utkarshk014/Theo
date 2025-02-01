export interface Message {
  user: string;
  ai: string;
  userTokens: number;
  aiTokens: number;
  createdAt: string;
}

export interface Conversation {
  conversation_id: number;
  messages: Message[];
  total_tokens: number;
  is_complete: boolean;
  is_generating_summary?: boolean;
  has_context_summary?: boolean;
  title?: string;
  status: string;
}

export interface ConversationStatus {
  id: number;
  total_tokens: number;
  message_count: number;
  is_complete: boolean;
  is_generating_summary: boolean;
  has_context_summary: boolean;
  title: string;
}

// Chapter Types
export interface Subtopic {
  id: number;
  title: string;
  order: number;
  content: string;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  order: number;
  subtopics: Subtopic[];
  progress: number;
}

// Progress Types
export interface ProgressUpdate {
  chapter_id: number;
  subtopic_id: number;
}

export interface Progress {
  current_progress: {
    chapter_id: number;
    chapter_title: string;
    chapter_order: number;
    subtopic_id: number;
    subtopic_title: string;
    subtopic_order: number;
  };
  completion_status: {
    completed_chapters: number[];
    completed_subtopics: number[];
    total_chapters: number;
    total_subtopics: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
export interface Doubt {
  question: string;
  last_response?: string;
}

export interface DoubtResponse {
  response: string;
  context: {
    current_chapter: string;
    current_subtopic: string;
  };
}
