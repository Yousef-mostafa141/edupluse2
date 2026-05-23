"use client";

import { motion } from "framer-motion";
import { BookOpen, Brain, Layers, HelpCircle, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const books = [
  { title: "Biology Grade 11", chapters: 12, progress: 65 },
  { title: "Chemistry Fundamentals", chapters: 8, progress: 40 },
  { title: "Arabic Literature", chapters: 15, progress: 20 },
];

const tools = [
  { icon: Brain, title: "AI Summary", desc: "Smart chapter summaries" },
  { icon: HelpCircle, title: "Quiz Generator", desc: "Auto-generated quizzes" },
  { icon: Layers, title: "Flashcards", desc: "Spaced repetition cards" },
  { icon: Sparkles, title: "AI Explanations", desc: "Ask anything about the book" },
];

export default function BooksPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-display font-bold flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-accent-primary" />
        Ask Your Book
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book, i) => (
          <GlassCard key={book.title} delay={i * 0.1} className="cursor-pointer">
            <div className="w-full h-24 rounded-xl bg-accent-gradient/20 flex items-center justify-center text-4xl mb-4">
              📖
            </div>
            <h3 className="font-semibold">{book.title}</h3>
            <p className="text-xs text-muted mt-1">{book.chapters} chapters</p>
            <div className="mt-3 h-1.5 rounded-full bg-surface-card overflow-hidden">
              <motion.div
                className="h-full bg-accent-gradient"
                initial={{ width: 0 }}
                whileInView={{ width: `${book.progress}%` }}
              />
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <GlassCard key={tool.title} delay={i * 0.08}>
              <Icon className="w-8 h-8 text-accent-secondary mb-3" />
              <h3 className="font-semibold">{tool.title}</h3>
              <p className="text-sm text-muted mt-1">{tool.desc}</p>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard>
        <h3 className="font-semibold mb-3">Recent AI Summary</h3>
        <p className="text-sm text-muted leading-relaxed">
          Chapter 4 covers cellular respiration — the process by which cells convert glucose and oxygen into ATP energy. The three main stages are glycolysis, the Krebs cycle, and the electron transport chain...
        </p>
      </GlassCard>
    </div>
  );
}
