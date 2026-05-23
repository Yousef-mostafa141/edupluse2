"use client";

import { useEffect, useState } from "react";
import { Bell, Globe, CheckCircle2 } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  content: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/announcements");
      if (!response.ok) {
        throw new Error("Unable to load notifications.");
      }
      const data = await response.json();
      setNotifications(data || []);
    } catch (error: any) {
      setError(error?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-3xl bg-accent-primary/10 text-accent-primary">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Notifications</h1>
            <p className="text-sm text-muted">Announcements and study alerts tailored for you.</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="glass-card rounded-3xl border border-[var(--border)] p-8 text-center text-muted">
          Loading notifications...
        </div>
      )}

      {error && (
        <div className="rounded-3xl bg-danger/10 border border-danger/20 p-6 text-sm text-danger">{error}</div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="glass-card rounded-3xl border border-[var(--border)] p-8 text-center text-muted">
          No new notifications right now. Check back after your next study session.
        </div>
      )}

      <div className="space-y-4">
        {notifications.map((notification) => (
          <article key={notification.id} className="glass-card rounded-3xl border border-[var(--border)] p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-muted">{notification.type || "Update"}</p>
                <h2 className="text-lg font-semibold">{notification.title}</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-muted">
                <CheckCircle2 className="w-4 h-4" />
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">{notification.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
