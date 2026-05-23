import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { AIDemo } from "@/components/landing/ai-demo";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-bg">
      <Navbar />
      <Hero />
      <Features />
      <AIDemo />
      <HowItWorks />
      <Footer />
    </main>
  );
}
