"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Palette, Target, Smartphone, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Daily Living Support",
    description: "Assistance with routines, personal care, and independent living skills.",
  },
  {
    icon: Target,
    title: "Community Participation",
    description: "Build confidence and stay connected through social and community activities.",
  },
  {
    icon: Palette,
    title: "Capacity Building",
    description: "Support designed to develop life skills and long-term independence.",
  },
  {
    icon: Shield,
    title: "Safe & Respectful Care",
    description: "A trusted team focused on dignity, safeguarding, and consistent quality.",
  },
  {
    icon: Smartphone,
    title: "Flexible Scheduling",
    description: "Support sessions arranged around your preferred routines and availability.",
  },
  {
    icon: Globe,
    title: "Plan Coordination Guidance",
    description: "Help understanding funding categories, service bookings, and plan reviews.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="services" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            NDIS Services We Offer
          </h2>
          <p className="text-[#808080] text-lg max-w-xl mx-auto">
            Practical, participant-focused supports delivered by a caring local team
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-[#141414] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#2563eb]/10 flex items-center justify-center mb-4 group-hover:bg-[#2563eb]/20 transition-colors">
                <feature.icon className="w-5 h-5 text-[#2563eb]" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#808080] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
