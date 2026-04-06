"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Share2,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PhotoCard from "@/components/PhotoCard";
import type { GeneratedPhoto, Session } from "@/lib/supabase/types";

interface ResultsData {
  session: Session;
  photos: GeneratedPhoto[];
}

export default function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const [data, setData] = useState<ResultsData | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
    // Poll if still generating
    const interval = setInterval(() => {
      fetchResults();
    }, 5000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    if (data?.session.status === "completed") {
      // Stop polling
    }
  }, [data]);

  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch {
      // Silently retry
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (photoId: string) => {
    setSelectedPhotos((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });
  };

  const downloadPhoto = async (url: string, name: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `profileai-${name}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const downloadSelected = async () => {
    if (!data) return;
    const photos = data.photos.filter(
      (p) => selectedPhotos.has(p.id) && p.image_url
    );
    for (const photo of photos) {
      await downloadPhoto(photo.image_url!, photo.scene_type);
      await new Promise((r) => setTimeout(r, 500));
    }
  };

  const downloadAll = async () => {
    if (!data) return;
    const completedPhotos = data.photos.filter(
      (p) => p.status === "completed" && p.image_url
    );
    for (const photo of completedPhotos) {
      await downloadPhoto(photo.image_url!, photo.scene_type);
      await new Promise((r) => setTimeout(r, 500));
    }
  };

  const regeneratePhoto = async (photoId: string) => {
    try {
      await fetch(`/api/sessions/${sessionId}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });
      fetchResults();
    } catch {
      // Handle error silently
    }
  };

  const completedCount =
    data?.photos.filter((p) => p.status === "completed").length || 0;
  const allCompleted = completedCount === 6;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Navbar />
        <Loader2 className="w-8 h-8 text-[#e50914] animate-spin" />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <p className="text-white text-lg mb-4">Session not found</p>
          <Link
            href="/generate"
            className="text-[#e50914] hover:underline"
          >
            Create a new profile
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="pt-20 pb-10 px-4 max-w-5xl mx-auto page-transition">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/generate"
              className="inline-flex items-center gap-1.5 text-sm text-[#808080] hover:text-white transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              New Session
            </Link>
            <h1 className="text-3xl font-bold text-white">Your Photos</h1>
            <div className="flex items-center gap-2 mt-2">
              {allCompleted ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  All 6 photos ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-[#e50914]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {completedCount}/6 photos generated
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {selectedPhotos.size > 0 && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={downloadSelected}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e50914] text-white text-sm font-medium hover:bg-[#f6121d] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download ({selectedPhotos.size})
              </motion.button>
            )}
            {allCompleted && (
              <button
                onClick={downloadAll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181818] border border-[#2a2a2a] text-white text-sm font-medium hover:bg-[#282828] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download All
              </button>
            )}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {data.photos
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((photo) => (
              <PhotoCard
                key={photo.id}
                imageUrl={photo.image_url}
                sceneType={photo.scene_type}
                description={photo.prompt.slice(0, 60) + "..."}
                status={photo.status}
                sortOrder={photo.sort_order}
                onDownload={
                  photo.image_url
                    ? () => downloadPhoto(photo.image_url!, photo.scene_type)
                    : undefined
                }
                onRegenerate={() => regeneratePhoto(photo.id)}
                onSelect={() => toggleSelect(photo.id)}
                isSelected={selectedPhotos.has(photo.id)}
              />
            ))}
        </div>

        {/* Tips Section */}
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-6 rounded-2xl bg-[#141414] border border-[#2a2a2a]"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Profile Tips
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Lead with your best",
                  desc: "Use the Hero photo as your first image - first impressions matter.",
                },
                {
                  title: "Show variety",
                  desc: "Mix up your photos to show different sides of your personality.",
                },
                {
                  title: "Order matters",
                  desc: "Put your most engaging photos first - many people only see 2-3.",
                },
                {
                  title: "Keep it fresh",
                  desc: "Update your photos regularly to stay relevant in the algorithm.",
                },
              ].map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#e50914] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {tip.title}
                    </p>
                    <p className="text-xs text-[#808080] mt-0.5">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Generate more */}
        <div className="mt-8 text-center">
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#181818] border border-[#2a2a2a] text-white font-medium hover:bg-[#282828] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Generate New Set
          </Link>
        </div>
      </div>
    </main>
  );
}
