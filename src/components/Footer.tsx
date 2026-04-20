"use client";

import { HeartHandshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[#2a2a2a]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#2563eb] to-[#38bdf8] flex items-center justify-center">
            <HeartHandshake className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">
            Ahura<span className="text-[#38bdf8]">NDIS</span>
          </span>
        </div>
        <p className="text-xs text-[#808080]">
          Supporting participants and families with respectful, person-centred NDIS care.
        </p>
      </div>
    </footer>
  );
}
