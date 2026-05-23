"use client";

import { motion } from "framer-motion";
import { Mic, ArrowLeft } from "lucide-react";
import { AIOrb } from "@/components/ui/ai-orb";
import Link from "next/link";
import { useState } from "react";

export default function VoiceAIPage() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const toggleListen = () => {
    setListening(!listening);
    if (!listening) {
      setTranscript("Listening...");
      setTimeout(() => {
        setTranscript("Can you explain the water cycle in simple terms?");
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] relative neural-bg rounded-3xl overflow-hidden">
      <Link
        href="/dashboard/chat"
        className="absolute top-4 left-4 flex items-center gap-2 text-sm text-muted hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Chat
      </Link>

      <AIOrb size="xl" />

      <div className="flex items-end gap-1 h-20 mt-12 mb-8">
        {[...Array(32)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-accent-gradient rounded-full"
            animate={{
              height: listening
                ? [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 80}%`]
                : "20%",
            }}
            transition={{
              duration: 0.3 + Math.random() * 0.3,
              repeat: listening ? Infinity : 0,
              delay: i * 0.02,
            }}
          />
        ))}
      </div>

      {transcript && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted max-w-md px-4 mb-8 italic"
        >
          &ldquo;{transcript}&rdquo;
        </motion.p>
      )}

      <motion.button
        onClick={toggleListen}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
          listening
            ? "bg-danger shadow-[0_0_40px_rgba(239,68,68,0.5)]"
            : "bg-accent-gradient shadow-glow"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={listening ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1, repeat: listening ? Infinity : 0 }}
      >
        <Mic className="w-8 h-8 text-white" />
      </motion.button>

      <p className="text-sm text-muted mt-4">
        {listening ? "Tap to stop" : "Tap to speak"}
      </p>
    </div>
  );
}
