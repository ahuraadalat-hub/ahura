"use client";

import { motion } from "framer-motion";
import { Camera, Brain, ImageIcon, Download } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Discovery Call",
    description: "Tell us about your goals, support needs, and current NDIS plan.",
    color: "#2563eb",
  },
  {
    icon: Brain,
    title: "Personal Support Plan",
    description: "We design a practical weekly support schedule around your preferences.",
    color: "#38bdf8",
  },
  {
    icon: ImageIcon,
    title: "Service Commencement",
    description: "Our qualified team starts delivering supports at home and in the community.",
    color: "#2563eb",
  },
  {
    icon: Download,
    title: "Ongoing Reviews",
    description: "We track outcomes and adjust supports as your goals evolve.",
    color: "#38bdf8",
  },
];

export default function HowItWorks() {
  return (
    <section id="process" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            How We Work With You
          </h2>
          <p className="text-[#808080] text-lg max-w-xl mx-auto">
            A simple four-step process built around your NDIS goals
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
              <div className="p-6 rounded-2xl bg-[#181818] border border-[#2a2a2a] hover:border-[#2563eb]/30 transition-all duration-300">
                {/* Step number */}
                <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-[#2563eb] flex items-center justify-center text-xs font-bold text-white">
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
