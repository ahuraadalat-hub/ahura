"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, ImageIcon, Check, Loader2 } from "lucide-react";

interface GenerationProgressProps {
  stage: "uploading" | "analyzing" | "generating" | "completed";
  completedPhotos: number;
  totalPhotos: number;
}

const stages = [
  { key: "uploading", label: "Uploading selfie", icon: Loader2 },
  { key: "analyzing", label: "Gemini Pro analyzing your features", icon: Brain },
  { key: "generating", label: "Nano Banana Pro generating photos", icon: ImageIcon },
  { key: "completed", label: "All photos ready!", icon: Check },
];

export default function GenerationProgress({
  stage,
  completedPhotos,
  totalPhotos,
}: GenerationProgressProps) {
  const currentIndex = stages.findIndex((s) => s.key === stage);
  const progress =
    stage === "completed"
      ? 100
      : stage === "generating"
        ? 25 + (completedPhotos / totalPhotos) * 60
        : stage === "analyzing"
          ? 15
          : 5;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden mb-8">
        <motion.div
          className="absolute inset-y-0 left-0 progress-fill rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {stages.map((s, i) => {
          const isActive = i === currentIndex;
          const isDone = i < currentIndex;
          const Icon = s.icon;

          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-[#e50914]/10 border border-[#e50914]/20"
                  : isDone
                    ? "opacity-60"
                    : "opacity-30"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  isActive
                    ? "bg-[#e50914]"
                    : isDone
                      ? "bg-green-600"
                      : "bg-[#2a2a2a]"
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Icon
                    className={`w-4 h-4 text-white ${
                      isActive ? "animate-spin" : ""
                    }`}
                  />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    isActive ? "text-white" : "text-[#808080]"
                  }`}
                >
                  {s.label}
                </p>
                {isActive && stage === "generating" && (
                  <p className="text-xs text-[#808080] mt-0.5">
                    {completedPhotos} of {totalPhotos} photos
                  </p>
                )}
              </div>
              <AnimatePresence>
                {isDone && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs text-green-400"
                  >
                    Done
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
