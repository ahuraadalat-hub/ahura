"use client";

import { motion } from "framer-motion";
import { Camera, Brain, ImageIcon, Download } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Take a Selfie",
    description: "Snap a quick selfie using your camera. Just one photo is all we need.",
    color: "#e50914",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Gemini Pro analyzes your features and crafts 6 unique photo scenarios.",
    color: "#ff6b6b",
  },
  {
    icon: ImageIcon,
    title: "Photo Generation",
    description: "Nano Banana Pro generates stunning, professional-quality dating photos.",
    color: "#e50914",
  },
  {
    icon: Download,
    title: "Download & Use",
    description: "Pick your favorites and upload them directly to Tinder or Hinge.",
    color: "#ff6b6b",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-[#808080] text-lg max-w-xl mx-auto">
            From selfie to dating profile in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative group"
            >
              <div className="p-6 rounded-2xl bg-[#181818] border border-[#2a2a2a] hover:border-[#e50914]/30 transition-all duration-300">
                {/* Step number */}
                <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-[#e50914] flex items-center justify-center text-xs font-bold text-white">
                  {i + 1}
                </div>

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#808080] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
