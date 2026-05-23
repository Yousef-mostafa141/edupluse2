"use client";

import { useEffect, useState, DragEvent, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, Paperclip, RefreshCcw } from "lucide-react";

type UploadedFile = {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  aiSummary: string;
  createdAt: string;
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 bytes";
  const k = 1024;
  const sizes = ["bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    setStatusMessage("");
    setErrorMessage("");
    try {
      const response = await fetch("/api/upload");
      if (!response.ok) {
        throw new Error("Unable to load uploaded files.");
      }
      const files = await response.json();
      setUploadedFiles(files || []);
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to load uploaded files.");
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please select a file before uploading.");
      return;
    }

    setUploading(true);
    setStatusMessage("Uploading...");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Upload failed.");
      }

      setUploadedFiles((current) => [result, ...current]);
      setSelectedFile(null);
      setStatusMessage("Upload complete. Study summary generated.");
    } catch (error: any) {
      setErrorMessage(error?.message || "Upload failed. Please try again.");
      setStatusMessage("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-display font-bold">Upload Files</h1>
        <p className="text-sm text-muted">Upload your study material and receive AI-powered summaries.</p>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <motion.div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all overflow-hidden ${
            dragging ? "border-accent-primary bg-accent-primary/10 shadow-glow" : "border-accent-primary/30 hover:border-accent-primary/60"
          }`}
          whileHover={{ scale: 1.01 }}
        >
          <Upload className="w-12 h-12 text-accent-primary mx-auto mb-4" />
          <p className="font-medium mb-2">Drag & drop a file here, or choose it manually.</p>
          <p className="text-sm text-muted">Supported formats: PDF, DOCX, TXT, images. Up to 100MB.</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,image/*"
            onChange={handleFileChange}
            className="absolute inset-x-0 bottom-4 mx-auto w-0 h-0 opacity-0"
          />
          <button
            type="button"
            onClick={() => document.querySelector<HTMLInputElement>("input[type=file]")?.click()}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent-primary/30 px-4 py-2 text-sm text-accent-primary hover:bg-white/5 transition"
          >
            <Paperclip className="w-4 h-4" />
            Select file
          </button>
        </motion.div>

        {selectedFile && (
          <div className="glass-card p-4 rounded-3xl border border-[var(--border)] flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{selectedFile.name}</p>
                <p className="text-sm text-muted">{formatBytes(selectedFile.size)}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Ready to upload</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">{selectedFile.type || "Unknown type"}</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted hover:text-white"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-3xl bg-accent-gradient px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload and Summarize"}
          </button>
          <button
            type="button"
            onClick={fetchUploadedFiles}
            className="inline-flex items-center gap-2 rounded-3xl border border-[var(--border)] px-5 py-3 text-sm text-muted hover:bg-white/5"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh library
          </button>
        </div>

        {statusMessage && (
          <div className="rounded-3xl bg-success/10 border border-success/20 px-4 py-3 text-sm text-success">
            {statusMessage}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-3xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger">
            {errorMessage}
          </div>
        )}
      </form>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Uploaded Study Files</h2>
            <p className="text-sm text-muted">Review summaries for your recent uploads.</p>
          </div>
          <span className="text-sm text-muted">{uploadedFiles.length} item{uploadedFiles.length === 1 ? "" : "s"}</span>
        </div>

        {uploadedFiles.length === 0 ? (
          <div className="glass-card rounded-3xl border border-[var(--border)] p-8 text-center text-muted">
            No uploaded files yet. Upload a study file to generate a summary.
          </div>
        ) : (
          <div className="grid gap-4">
            {uploadedFiles.map((file) => (
              <motion.article
                key={file.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl border border-[var(--border)] p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-lg">{file.fileName}</p>
                    <p className="text-sm text-muted">{formatBytes(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs font-medium text-muted">
                    <FileText className="w-4 h-4" /> Summary ready
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">{file.aiSummary || "No summary available."}</p>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
