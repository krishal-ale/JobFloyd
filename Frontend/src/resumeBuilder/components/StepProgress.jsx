import { Check } from "lucide-react";
import { shimmerStyle } from "../assets/dummystyle.js";

const StepProgress = ({ progress }) => {
  return (
    <>
      <style>{shimmerStyle}</style>

      <div className="relative w-full h-4 bg-blue-50 overflow-hidden rounded-full border border-blue-100">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-blue-200/40 animate-pulse"></div>

        <div
          className="relative h-full bg-gradient-to-r from-[#0066FF] via-blue-500 to-sky-500 animate-flow bg-[length:200%_100%] transition-all duration-700 ease-out rounded-full overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        </div>

        {progress > 0 && (
          <div
            className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/60 to-white/20 blur-sm"
            style={{ left: `${Math.max(0, progress - 4)}%` }}
          ></div>
        )}
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="text-xs font-bold text-slate-600">
          {progress < 25
            ? "Getting Started"
            : progress < 50
            ? "Making Progress"
            : progress < 75
            ? "Almost There"
            : "Nearly Complete"}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0066FF]">{progress}%</span>

          {progress === 100 && (
            <div className="w-6 h-6 bg-gradient-to-r from-[#0066FF] to-blue-500 rounded-full flex items-center justify-center">
              <Check size={12} className="text-white" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StepProgress;