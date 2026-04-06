"use client";

import { motion } from "framer-motion";
import { Download, RefreshCw, Check, Loader2 } from "lucide-react";
import Image from "next/image";

interface PhotoCardProps {
  imageUrl: string | null;
  sceneType: string;
  description: string;
  status: "pending" | "generating" | "completed" | "failed";
  sortOrder: number;
  onDownload?: () => void;
  onRegenerate?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

const sceneLabels: Record<string, string> = {
  hero: "Main Photo",
  adventure: "Adventure",
  social: "Social Scene",
  passion: "Your Passion",
  dressy: "Night Out",
  candid: "Candid Moment",
};

export default function PhotoCard({
  imageUrl,
  sceneType,
  description,
  status,
  sortOrder,
  onDownload,
  onRegenerate,
  onSelect,
  isSelected,
}: PhotoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: sortOrder * 0.1 }}
      className={`relative group rounded-xl overflow-hidden bg-[#181818] border-2 transition-all duration-300 ${
        isSelected
          ? "border-[#e50914] shadow-lg shadow-[#e50914]/20"
          : "border-[#2a2a2a] hover:border-[#3a3a3a]"
      }`}
    >
      {/* Image or placeholder */}
      <div className="aspect-[3/4] relative">
        {status === "completed" && imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={description}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Action buttons */}
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Save
                </button>
              )}
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center justify-center p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Selection indicator */}
            {onSelect && (
              <button
                onClick={onSelect}
                className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-[#e50914] text-white"
                    : "bg-black/40 backdrop-blur-sm text-white/60 hover:text-white"
                }`}
              >
                <Check className="w-4 h-4" />
              </button>
            )}
          </>
        ) : status === "generating" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center shimmer">
            <Loader2 className="w-8 h-8 text-[#e50914] animate-spin mb-3" />
            <p className="text-sm text-[#808080]">Generating...</p>
          </div>
        ) : status === "failed" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#181818]">
            <p className="text-sm text-red-400 mb-2">Generation failed</p>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e50914]/20 text-[#e50914] text-sm hover:bg-[#e50914]/30 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 shimmer" />
        )}
      </div>

      {/* Label */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#e50914] uppercase tracking-wider">
            {sceneLabels[sceneType] || sceneType}
          </span>
          <span className="text-xs text-[#808080]">#{sortOrder + 1}</span>
        </div>
        <p className="text-sm text-[#808080] mt-1 truncate">{description}</p>
      </div>
    </motion.div>
  );
}
