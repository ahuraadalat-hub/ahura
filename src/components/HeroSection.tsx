"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Blue glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563eb] rounded-full opacity-[0.07] blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#38bdf8] rounded-full opacity-[0.06] blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563eb]/10 border border-[#2563eb]/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-[#38bdf8]" />
              <span className="text-sm text-[#38bdf8] font-medium">
                Registered & Person-Centred NDIS Support
              </span>
            </motion.div>

          {/* Main title */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
              <span className="text-white">Compassionate</span>
              <br />
              <span className="bg-gradient-to-r from-[#2563eb] to-[#38bdf8] bg-clip-text text-transparent">
                NDIS Support
              </span>
              <br />
              <span className="text-white">for Everyday Life</span>
            </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#808080] max-w-2xl mx-auto mb-10 leading-relaxed">
            We help participants and families navigate the NDIS with confidence through{" "}
            <span className="text-white font-medium">reliable in-home, community, and plan support</span>{" "}
            tailored to individual goals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-semibold text-lg shadow-lg shadow-[#2563eb]/25 hover:shadow-[#2563eb]/40 transition-shadow"
              >
                <HeartHandshake className="w-5 h-5" />
                Explore Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link href="#contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[#181818] border border-[#2a2a2a] text-white font-medium text-lg hover:bg-[#282828] transition-colors"
              >
                Speak to Our Team
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "24/7", label: "Participant Support" },
            { value: "1:1", label: "Goal Planning" },
            { value: "Local", label: "Community Team" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-[#808080] mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
