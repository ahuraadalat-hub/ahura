"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import {
  Camera,
  FlipHorizontal,
  RotateCcw,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import GenerationProgress from "@/components/GenerationProgress";

type Platform = "tinder" | "hinge" | "both";
type Step = "setup" | "capture" | "preview" | "generating";

export default function GeneratePage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);

  const [step, setStep] = useState<Step>("setup");
  const [platform, setPlatform] = useState<Platform>("both");
  const [gender, setGender] = useState("");
  const [stylePreference, setStylePreference] = useState("");
  const [selfie, setSelfie] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [generationStage, setGenerationStage] = useState<
    "uploading" | "analyzing" | "generating" | "completed"
  >("uploading");
  const [completedPhotos, setCompletedPhotos] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelfie(imageSrc);
      setStep("preview");
    }
  }, []);

  const retake = () => {
    setSelfie(null);
    setStep("capture");
  };

  const startGeneration = async () => {
    if (!selfie) return;
    setStep("generating");
    setGenerationStage("uploading");
    setError(null);

    try {
      // Extract base64 data
      const base64Data = selfie.split(",")[1];

      // Step 1: Create session and upload selfie
      const sessionRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selfieBase64: base64Data,
          platform,
          gender: gender || null,
          stylePreference: stylePreference || null,
        }),
      });

      if (!sessionRes.ok) {
        throw new Error("Failed to create session");
      }

      const { sessionId } = await sessionRes.json();

      // Step 2: Generate prompts with Gemini
      setGenerationStage("analyzing");
      const promptsRes = await fetch(`/api/sessions/${sessionId}/analyze`, {
        method: "POST",
      });

      if (!promptsRes.ok) {
        throw new Error("Failed to analyze selfie");
      }

      // Step 3: Generate images
      setGenerationStage("generating");
      const generateRes = await fetch(`/api/sessions/${sessionId}/generate`, {
        method: "POST",
      });

      if (!generateRes.ok) {
        throw new Error("Failed to start image generation");
      }

      // Poll for completion
      const pollInterval = setInterval(async () => {
        const statusRes = await fetch(`/api/sessions/${sessionId}`);
        const statusData = await statusRes.json();

        const completed = statusData.photos.filter(
          (p: { status: string }) => p.status === "completed"
        ).length;
        setCompletedPhotos(completed);

        if (
          statusData.session.status === "completed" ||
          completed === statusData.photos.length
        ) {
          clearInterval(pollInterval);
          setGenerationStage("completed");
          setTimeout(() => {
            router.push(`/results/${sessionId}`);
          }, 1500);
        }

        if (statusData.session.status === "failed") {
          clearInterval(pollInterval);
          throw new Error("Generation failed");
        }
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("preview");
    }
  };

  const platforms: { value: Platform; label: string; emoji: string }[] = [
    { value: "tinder", label: "Tinder", emoji: "🔥" },
    { value: "hinge", label: "Hinge", emoji: "💜" },
    { value: "both", label: "Both", emoji: "✨" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="pt-20 pb-10 px-4 max-w-lg mx-auto page-transition">
        <AnimatePresence mode="wait">
          {/* STEP 1: Setup */}
          {step === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Create Your Profile
                </h1>
                <p className="text-[#808080]">
                  Customize your photo generation preferences
                </p>
              </div>

              {/* Platform selection */}
              <div>
                <label className="text-sm font-medium text-[#808080] uppercase tracking-wider mb-3 block">
                  Platform
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {platforms.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPlatform(p.value)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        platform === p.value
                          ? "border-[#e50914] bg-[#e50914]/10"
                          : "border-[#2a2a2a] bg-[#181818] hover:border-[#3a3a3a]"
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{p.emoji}</span>
                      <span
                        className={`text-sm font-medium ${
                          platform === p.value ? "text-white" : "text-[#808080]"
                        }`}
                      >
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-medium text-[#808080] uppercase tracking-wider mb-3 block">
                  Gender (optional)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Male", "Female", "Non-binary"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(gender === g ? "" : g)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        gender === g
                          ? "border-[#e50914] bg-[#e50914]/10 text-white"
                          : "border-[#2a2a2a] bg-[#181818] text-[#808080] hover:border-[#3a3a3a]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style preference */}
              <div>
                <label className="text-sm font-medium text-[#808080] uppercase tracking-wider mb-3 block">
                  Style Vibe (optional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Natural & Casual",
                    "Polished & Professional",
                    "Edgy & Bold",
                    "Warm & Approachable",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        setStylePreference(stylePreference === s ? "" : s)
                      }
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        stylePreference === s
                          ? "border-[#e50914] bg-[#e50914]/10 text-white"
                          : "border-[#2a2a2a] bg-[#181818] text-[#808080] hover:border-[#3a3a3a]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep("capture")}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#e50914] to-[#c11119] text-white font-semibold text-lg shadow-lg shadow-[#e50914]/25 hover:shadow-[#e50914]/40 transition-shadow"
              >
                <Camera className="w-5 h-5" />
                Open Camera
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Camera */}
          {step === "capture" && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-1">
                  Take Your Selfie
                </h2>
                <p className="text-sm text-[#808080]">
                  Face the camera with good lighting. This photo will be used as
                  a reference.
                </p>
              </div>

              {/* Camera viewfinder */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4]">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.92}
                  videoConstraints={{
                    facingMode,
                    width: 720,
                    height: 960,
                    aspectRatio: 3 / 4,
                  }}
                  className="w-full h-full object-cover"
                  mirrored={facingMode === "user"}
                />

                {/* Viewfinder overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-56 rounded-full viewfinder-ring" />
                </div>

                {/* Flip camera button */}
                <button
                  onClick={() =>
                    setFacingMode(
                      facingMode === "user" ? "environment" : "user"
                    )
                  }
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
                >
                  <FlipHorizontal className="w-5 h-5" />
                </button>

                {/* Back button */}
                <button
                  onClick={() => setStep("setup")}
                  className="absolute top-4 left-4 p-2.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Capture button */}
              <div className="flex justify-center">
                <button
                  onClick={capture}
                  className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                  <div className="w-14 h-14 rounded-full bg-white" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Preview */}
          {step === "preview" && selfie && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-1">
                  Looking Good!
                </h2>
                <p className="text-sm text-[#808080]">
                  Happy with this selfie? Let&apos;s generate your profile photos.
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Preview image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <img
                  src={selfie}
                  alt="Your selfie"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 netflix-gradient pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Sparkles className="w-4 h-4 text-[#e50914]" />
                    <span>
                      {platform === "both"
                        ? "Tinder & Hinge"
                        : platform.charAt(0).toUpperCase() + platform.slice(1)}{" "}
                      optimized
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={retake}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#181818] border border-[#2a2a2a] text-white font-medium hover:bg-[#282828] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake
                </button>
                <button
                  onClick={startGeneration}
                  className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#e50914] to-[#c11119] text-white font-semibold shadow-lg shadow-[#e50914]/25 hover:shadow-[#e50914]/40 transition-shadow"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Photos
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Generating */}
          {step === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 pt-10"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Creating Your Photos
                </h2>
                <p className="text-sm text-[#808080]">
                  Sit tight, our AI is working its magic...
                </p>
              </div>

              {/* Animated selfie preview */}
              {selfie && (
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden pulse-glow">
                  <img
                    src={selfie}
                    alt="Your selfie"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <GenerationProgress
                stage={generationStage}
                completedPhotos={completedPhotos}
                totalPhotos={6}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
