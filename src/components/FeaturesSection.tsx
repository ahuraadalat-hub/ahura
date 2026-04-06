"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Palette, Target, Smartphone, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "6 professional photos generated in under 60 seconds.",
  },
  {
    icon: Target,
    title: "Platform Optimized",
    description: "Photos tailored specifically for Tinder and Hinge algorithms.",
  },
  {
    icon: Palette,
    title: "Diverse Scenes",
    description: "Travel, social, dressy, candid - a full range for your profile.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your selfie is processed securely and never shared.",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Perfect 4:3 portrait ratio for dating app profiles.",
  },
  {
    icon: Globe,
    title: "AI Powered",
    description: "Gemini Pro + Nano Banana Pro for stunning, realistic results.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Why ProfileAI?
          </h2>
          <p className="text-[#808080] text-lg max-w-xl mx-auto">
            Everything you need for the perfect dating profile
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
              <div className="w-11 h-11 rounded-xl bg-[#e50914]/10 flex items-center justify-center mb-4 group-hover:bg-[#e50914]/20 transition-colors">
                <feature.icon className="w-5 h-5 text-[#e50914]" />
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
