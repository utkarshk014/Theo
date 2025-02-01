import { Brain } from "lucide-react";

export const TheoBrainLogoThinking = () => {
  return (
    <div className="h-20 w-20 relative group cursor-pointer">
      <div className="absolute inset-0 rounded-full bg-slate-900 flex items-center justify-center">
        <Brain
          className="w-12 h-12 text-emerald-500 group-hover:text-indigo-300 transition-all duration-300"
          strokeWidth={1.5}
        />
        {/* Pulsing circles representing thought processes */}
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/50 animate-ping" />
        <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-pulse" />
      </div>
    </div>
  );
};

export const TheoBrainLogoThinkingSmall = () => {
  return (
    <div className="h-12 w-12 relative group cursor-pointer">
      <div className="absolute inset-0 rounded-full bg-slate-900 flex items-center justify-center">
        <Brain
          className="w-6 h-6 text-emerald-500 group-hover:text-indigo-300 transition-all duration-300"
          strokeWidth={1.5}
        />
        {/* Pulsing circles representing thought processes */}
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/50 animate-ping" />
        <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-pulse" />
      </div>
    </div>
  );
};

export const TheoBrainLogo = () => {
  return (
    <div className="h-12 w-12 relative group cursor-pointer">
      <div className="absolute inset-0 rounded-full bg-primaryCard flex items-center justify-center">
        <Brain
          className="w-6 h-6 text-emerald-500 group-hover:text-indigo-300 transition-all duration-300"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
};

export const TheoLoader = () => {
  return (
    <div className="h-[500px] w-[500px] relative group">
      <div className="absolute inset-0 rounded-full flex items-center justify-center">
        <Brain className="w-60 h-60 text-gray-600/80 z-10" strokeWidth={1.5} />

        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "12s" }}
        >
          {/* Dots on the inner circle */}
          <div
            className="absolute rounded-full w-2 h-2 bg-slate-600 animate-dot-rotate-inner-1"
            style={{
              top: "10%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute rounded-full w-2 h-2 bg-slate-600 animate-dot-rotate-inner-2"
            style={{
              top: "89%",
              left: "60%",
              transform: "translate(-50%, -50%)",
            }}
          />

          <div
            className="absolute rounded-full w-2 h-2 bg-slate-600 animate-dot-rotate-inner-2"
            style={{
              top: "42%",
              left: "10%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Dots on the outer circle */}
          <div
            className="absolute rounded-full w-2 h-2 bg-slate-600 animate-dot-rotate-outer-1"
            style={{
              top: "75%",
              left: "12%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute rounded-full w-2 h-2 bg-slate-600 animate-dot-rotate-outer-2"
            style={{
              top: "76%",
              left: "88%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute rounded-full w-2 h-2 bg-slate-600 animate-dot-rotate-outer-3"
            style={{
              top: "96%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        <div className="absolute inset-2">
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <circle
              cx="24"
              cy="24"
              r="20"
              className="fill-none stroke-indigo-500/20 animate-pulse"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        <div className="absolute inset-0">
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <circle
              cx="24"
              cy="24"
              r="22"
              className="fill-none stroke-emerald-600/20 animate-pulse"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      </div>

      <div className="absolute inset-0 rounded-full">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-700/20 via-indigo-500/10 to-slate-700/20 animate-pulse" />
      </div>
    </div>
  );
};

export const TheoLogo = () => {
  return (
    <div className="relative group cursor-pointer">
      <div className="h-10 rounded-full flex items-center justify-center">
        <span className="text-4xl font-bold text-slate-100 tracking-tight">
          Theo
        </span>
        <div className="ml-1 w-2 h-2 rounded-full bg-emerald-600" />
      </div>
    </div>
  );
};

export const TheoLogoBig = () => {
  return (
    <div className="relative group cursor-pointer">
      <div className="h-20 px-4 rounded-full flex items-center justify-center">
        <span className="text-8xl font-bold text-slate-100 tracking-tight">
          Theo
        </span>
        <div className="ml-1 w-2 h-2 rounded-full bg-emerald-500" />
      </div>
    </div>
  );
};
