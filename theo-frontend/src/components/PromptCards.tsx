import React from "react";

const PromptCards = () => {
  const cards = [
    {
      title: "Portfolio Analysis",
      description:
        "Ask AI to analyze your investment portfolio and suggest potential optimizations based on your risk tolerance and goals.",
    },
    {
      title: "Market Trends",
      description:
        "Get insights about current market trends, sector performance, and potential investment opportunities across different markets.",
    },
    {
      title: "Risk Assessment",
      description:
        "Request AI to evaluate specific stocks or investments and highlight potential risks and warning signals to watch for.",
    },
    {
      title: "Strategy Planning",
      description:
        "Learn about different investment strategies and get personalized suggestions based on your financial situation.",
    },
  ];

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group relative bg-primaryCard border border-primaryCardBorder rounded-[10px] p-4 shadow-lg cursor-pointer transition-all duration-300 ease-in-out animate-fade-in overflow-hidden backdrop-blur-sm bg-opacity-50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full before:animate-shimmer before:pointer-events-none"
            style={{
              animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className="relative z-10">
              <h3 className="text-xl text-left font-bold mb-3 text-white">
                {card.title}
              </h3>
              <p className="text-gray-400 text-left text-sm">
                {card.description}
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
};

export default PromptCards;
