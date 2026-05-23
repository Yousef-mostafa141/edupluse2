import { Navbar } from "@/components/landing/navbar";
import Link from "next/link";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-bg">
      <Navbar />

      <section className="py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-display font-bold mb-4">EduPulse — School platform</h1>
          <p className="text-muted mb-8">Sign in to access your dashboard and real school data.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login" className="btn-glow px-6 py-3 rounded-xl bg-accent text-white">Login</Link>
            <Link href="/signup" className="px-6 py-3 rounded-xl border border-[var(--border)]">Sign up</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
