export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface SubTopic {
  id: number;
  title: string;
  content: string;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  subtopics: SubTopic[];
}

export interface LearningProgress {
  completedTopics: number[];
  currentTopic: number;
}
