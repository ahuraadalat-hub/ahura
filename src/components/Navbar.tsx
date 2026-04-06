"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 netflix-gradient-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e50914] to-[#ff6b6b] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Profile<span className="text-[#e50914]">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {pathname !== "/" && (
              <Link
                href="/"
                className="text-sm text-[#808080] hover:text-white transition-colors"
              >
                Home
              </Link>
            )}
            {pathname !== "/generate" && (
              <Link
                href="/generate"
                className="text-sm px-4 py-2 rounded-md bg-[#e50914] hover:bg-[#f6121d] text-white font-medium transition-colors"
              >
                Create Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
