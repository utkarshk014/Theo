import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function FormattedAIResponse({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-medium mb-2">{children}</h3>
        ),
        strong: ({ children }) => (
          <strong className="text-emerald-500 font-semibold">{children}</strong>
        ),
        ul: ({ children }) => (
          <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal ml-6 mb-4 space-y-2">{children}</ol>
        ),
        li: ({ children }) => <li className="text-gray-200">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-emerald-500 pl-4 my-4 italic">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
