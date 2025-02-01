// // app/chapters/[chapterId]/page.tsx
// "use client";

// import { useParams } from "next/navigation";
// import { LearningArea } from "@/components/LearningArea";
// import { useState, useEffect } from "react";
// import { Chapter, LearningProgress } from "@/app/lib/types";

// // This would come from your API/database
// const sampleChapter: Chapter = {
//   id: 1,
//   title: "Stock Market Basics",
//   description: "Your first step into the exciting world of stock markets.",
//   subtopics: [
//     {
//       id: 1,
//       title: "What is a Stock Market?",
//       content: `Let me explain the stock market in cricket termsidwasivbiwqbdvb qewg 9e iwivbwiubvbifebvbefbvibfiuvbefi ihv hepiufv pwo urwhfwhrfuhwpruhf uwhrfouwhrf[ohqwr owhrfowhrfohwr oihrfowh horhowhf]...`,
//     },
//     // ... other subtopics
//   ],
// };

// export default function ChapterPage() {
//   const params = useParams();
//   const [progress, setProgress] = useState<LearningProgress>({
//     completedTopics: [],
//     currentTopic: 0,
//   });

//   // In a real app, you'd fetch the chapter data and progress from your API
//   useEffect(() => {
//     // Load progress from localStorage or API
//     const savedProgress = localStorage.getItem(
//       `chapter-${params.chapterId}-progress`
//     );
//     if (savedProgress) {
//       setProgress(JSON.parse(savedProgress));
//     }
//   }, [params.chapterId]);

//   const handleProgressUpdate = (newProgress: LearningProgress) => {
//     setProgress(newProgress);
//     // Save progress to localStorage or API
//     localStorage.setItem(
//       `chapter-${params.chapterId}-progress`,
//       JSON.stringify(newProgress)
//     );
//   };

//   return (
//     <div className="min-h-screen bg-black">
//       <LearningArea
//         chapter={sampleChapter}
//         progress={progress}
//         onProgressUpdate={handleProgressUpdate}
//       />
//     </div>
//   );
// }

// app/chapters/[chapterId]/page.tsx
// app/chapters/[chapterId]/page.tsx

// "use client";

// import { useParams } from "next/navigation";
// import { LearningArea } from "@/components/LearningArea";
// import { useState, useEffect } from "react";
// import { Chapter, Progress } from "@/app/lib/api";
// import { useApi } from "@/app/hooks/useApi";
// import { useNotification } from "@/app/hooks/useNotifications";
// import { Spinner } from "@/components/Spinner";

// export default function ChapterPage() {
//   const params = useParams();
//   const api = useApi();
//   const { addNotification } = useNotification();

//   const [chapter, setChapter] = useState<Chapter | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [progress, setProgress] = useState<Progress>();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);

//         // Fetch chapter data
//         const chapterResponse = await api.getChapter(Number(params.chapterId));
//         if (chapterResponse.error || !chapterResponse.data) {
//           addNotification("error", "Failed to load chapter", "chapter");
//           return;
//         }

//         // Fetch progress data
//         const progressResponse = await api.getProgress();
//         if (progressResponse.error || !progressResponse.data) {
//           addNotification("error", "Failed to load progress", "progress");
//           return;
//         }

//         setChapter(chapterResponse.data);
//         setProgress(progressResponse.data);
//       } catch (error) {
//         console.error(error);
//         addNotification("error", "Failed to load data", "data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [params.chapterId, api, addNotification]);

//   const handleProgressUpdate = async (understood: boolean) => {
//     try {
//       if (understood) {
//         // Update progress with current topic
//         const updateResponse = await api.updateProgress({
//           chapter_id: Number(params.chapterId),
//           subtopic_id: progress?.current_progress.subtopic_id ?? 0,
//         });

//         if (updateResponse.error) {
//           addNotification("error", "Failed to update progress", "progress");
//           return;
//         }

//         // Move to next topic
//         const nextResponse = await api.moveToNext();
//         if (nextResponse.error || !nextResponse.data) {
//           addNotification("error", "Failed to move to next topic", "progress");
//           return;
//         }

//         setProgress(nextResponse.data);
//       }
//     } catch (error) {
//       console.error(error);
//       addNotification("error", "Failed to update progress", "progress");
//     }
//   };

//   if (isLoading || !chapter) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-black">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black">
//       <LearningArea
//         chapter={chapter}
//         progress={progress}
//         onProgressUpdate={handleProgressUpdate}
//       />
//     </div>
//   );
// }

// app/chapters/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { LearningArea } from "@/components/LearningArea";
import { useState, useEffect } from "react";
import { Chapter, Progress } from "@/app/lib/api";
import { useApi } from "@/app/hooks/useApi";
import { useNotification } from "@/app/hooks/useNotifications";
import { Spinner } from "@/components/Spinner";
import { CHAPTERS } from "@/app/lib/constants";

export default function ChapterPage() {
  const params = useParams();
  const api = useApi();
  const { addNotification } = useNotification();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<Progress | null>(null);

  // Fetch initial progress and set chapter from constants
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Get chapter from constants
        const currentChapter = CHAPTERS.find((c) => {
          console.log(c.id, params.chapterId);
          return c.id === Number(params.chapterId);
        });
        if (!currentChapter) {
          addNotification("error", "Chapter not found", "chapter");
          // router.push("/");
          return;
        }

        // Fetch progress data
        const progressResponse = await api.getProgress();
        if (progressResponse.error || !progressResponse.data) {
          addNotification("error", "Failed to load progress", "progress");
          return;
        }

        setChapter(currentChapter);
        setProgress(progressResponse.data);
      } catch (error) {
        console.error(error);
        addNotification("error", "Failed to load data", "data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // params.id, api, addNotification, router

  const handleProgressUpdate = async (understood: boolean) => {
    if (!progress || !chapter) return;

    try {
      if (understood) {
        // Update progress with current topic
        const updateResponse = await api.updateProgress({
          chapter_id: chapter.id,
          subtopic_id: progress.current_progress.subtopic_id,
        });

        if (updateResponse.error) {
          addNotification("error", "Failed to update progress", "progress");
          return;
        }

        // Move to next topic
        const nextResponse = await api.moveToNext();
        if (nextResponse.error || !nextResponse.data) {
          addNotification("error", "Failed to move to next topic", "progress");
          return;
        }

        setProgress(nextResponse.data);
      }
    } catch (error) {
      console.error(error);
      addNotification("error", "Failed to update progress", "progress");
    }
  };

  if (isLoading || !chapter || !progress) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <LearningArea
        chapter={chapter}
        progress={progress}
        onProgressUpdate={handleProgressUpdate}
      />
    </div>
  );
}
