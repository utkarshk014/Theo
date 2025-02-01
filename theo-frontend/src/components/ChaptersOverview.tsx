import React from "react";
import { ArrowRight, BookOpen, Target } from "lucide-react";
import Link from "next/link";

type Chapter = {
  id: number;
  title: string;
  description: string;
  subtopics: string[];
};

const chapters: Chapter[] = [
  {
    id: 1,
    title: "Stock Market Basics",
    description:
      "Your first step into the exciting world of stock markets. Think of this as learning the basic rules of cricket before stepping onto the field.",
    subtopics: [
      "What is a Stock Market?",
      "Understanding Share Prices",
      "Types of Market Players",
      "Basic Market Terms",
      "Getting Started With Trading",
    ],
  },
  {
    id: 2,
    title: "Technical Analysis Fundamentals",
    description:
      "Learn to read the market's scorecard! Technical analysis is like studying pitch conditions and player statistics to make better decisions.",
    subtopics: [
      "Introduction to Charts",
      "Price Patterns",
      "Support and Resistance",
      "Moving Averages",
      "Volume Analysis",
    ],
  },
];

const ChapterCard = ({ chapter }: { chapter: Chapter }) => (
  <div className="bg-gradient-to-br from-black to-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800 hover:border-gray-700 transition-all">
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-xl">
          <BookOpen className="w-6 h-6 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-semibold text-white">
          Chapter {chapter.id}
        </h2>
      </div>
      <div className="px-4 py-1 bg-emerald-500/10 rounded-full">
        <span className="text-sm text-emerald-400">5 Topics</span>
      </div>
    </div>

    <h3 className="text-xl font-semibold text-white mb-3">{chapter.title}</h3>
    <p className="text-gray-400 mb-6">{chapter.description}</p>

    <div className="mb-8">
      <h4 className="text-white font-medium mb-4 flex items-center gap-2">
        <Target className="w-4 h-4 text-emerald-400" />
        What you&apos;ll learn
      </h4>
      <div className="grid grid-cols-1 gap-3">
        {chapter.subtopics.map((topic, index) => (
          <div key={index} className="flex items-center gap-3 text-gray-300">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span>{topic}</span>
          </div>
        ))}
      </div>
    </div>

    <Link
      href={`/chapters/${chapter.id}`}
      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
    >
      Start Learning
      <ArrowRight className="w-4 h-4" />
    </Link>
  </div>
);

const ChaptersOverview = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Course Chapters</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {chapters.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </div>
  );
};

export default ChaptersOverview;
