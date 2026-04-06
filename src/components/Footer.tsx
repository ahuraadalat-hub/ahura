"use client";

import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[#2a2a2a]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#e50914] to-[#ff6b6b] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">
            Profile<span className="text-[#e50914]">AI</span>
          </span>
        </div>
        <p className="text-xs text-[#808080]">
          AI-powered dating profile generator. Not affiliated with Tinder or Hinge.
        </p>
      </div>
    </footer>
  );
}
