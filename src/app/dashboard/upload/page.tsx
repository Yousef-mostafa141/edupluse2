"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { Particles } from "@/components/ui/particles";

const steps = [
  "Uploading...",
  "Extracting Text...",
  "Analyzing Content...",
  "Generating Summary...",
];

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  const startProcessing = useCallback(() => {
    setProcessing(true);
    setCurrentStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= steps.length) {
        clearInterval(interval);
        setDone(true);
        setProcessing(false);
      }
    }, 1500);
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-display font-bold">Upload Files</h1>

      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); startProcessing(); }}
        onClick={startProcessing}
        className={`relative border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all overflow-hidden ${
          dragging
            ? "border-accent-primary bg-accent-primary/10 shadow-glow"
            : "border-accent-primary/30 hover:border-accent-primary/60"
        }`}
        whileHover={{ scale: 1.01 }}
      >
        {processing && <Particles count={20} />}
        <Upload className="w-12 h-12 text-accent-primary mx-auto mb-4" />
        <p className="font-medium mb-1">Drag & drop your files here</p>
        <p className="text-sm text-muted">PDF, DOCX, images up to 50MB</p>
      </motion.div>

      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-card p-6 rounded-2xl space-y-4"
          >
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                {i < currentStep ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                ) : i === currentStep ? (
                  <motion.div
                    className="w-5 h-5 rounded-full border-2 border-accent-primary border-t-transparent shrink-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-white/10 shrink-0" />
                )}
                <span className={i <= currentStep ? "text-white" : "text-muted"}>
                  {step}
                </span>
              </div>
            ))}
            <div className="h-2 rounded-full bg-surface-card overflow-hidden mt-4">
              <motion.div
                className="h-full bg-accent-gradient"
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 rounded-2xl flex items-center gap-4"
        >
          <FileText className="w-10 h-10 text-accent-primary" />
          <div>
            <p className="font-medium">Physics_Chapter5.pdf</p>
            <p className="text-sm text-success">Ready • 32 pages analyzed</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
