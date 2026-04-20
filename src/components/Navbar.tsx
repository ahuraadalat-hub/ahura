import Link from "next/link";
import { HeartHandshake } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 netflix-gradient-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#38bdf8] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Ahura<span className="text-[#38bdf8]">NDIS</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="#services" className="text-sm text-[#cbd5e1] hover:text-white transition-colors">
              Services
            </Link>
            <Link href="#process" className="text-sm text-[#cbd5e1] hover:text-white transition-colors">
              Process
            </Link>
            <Link href="#about" className="text-sm text-[#cbd5e1] hover:text-white transition-colors">
              About
            </Link>
            <Link
              href="#contact"
              className="text-sm px-4 py-2 rounded-md bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
