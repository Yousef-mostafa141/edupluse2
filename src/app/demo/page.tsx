"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/dashboard"), 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return <LoadingScreen type="thinking" />;
}
