"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Users } from "lucide-react";
import { useApp } from "@/context/app-context";

type Contact = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

type ConversationMessage = {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
};

export default function MessagesPage() {
  const { t } = useApp();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchConversation(selectedContact.id);
    }
  }, [selectedContact]);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    setError("");

    try {
      const response = await fetch("/api/messages");
      if (!response.ok) {
        throw new Error("Unable to load contacts.");
      }
      const data = await response.json();
      setContacts(data || []);
      if (!selectedContact && Array.isArray(data) && data.length > 0) {
        setSelectedContact(data[0]);
      }
    } catch (error: any) {
      setError(error?.message || "Failed to load contacts.");
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchConversation = async (contactId: string) => {
    setLoadingConversation(true);
    setError("");

    try {
      const response = await fetch(`/api/messages?recipientId=${contactId}`);
      if (!response.ok) {
        throw new Error("Unable to load conversation.");
      }
      const data = await response.json();
      setMessages(data || []);
    } catch (error: any) {
      setError(error?.message || "Failed to load conversation.");
      setMessages([]);
    } finally {
      setLoadingConversation(false);
    }
  };

  const sendMessage = async () => {
    if (!draft.trim() || !selectedContact) return;
    setError("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: selectedContact.id, content: draft }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to send message.");
      }

      setDraft("");
      await fetchConversation(selectedContact.id);
    } catch (error: any) {
      setError(error?.message || "Unable to send message.");
    }
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr] max-w-6xl mx-auto">
      <section className="glass-card rounded-3xl border border-[var(--border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-2xl bg-accent-primary/10 p-3 text-accent-primary">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{t("messages")}</h1>
            <p className="text-sm text-muted">Connect with classmates, mentors and teachers.</p>
          </div>
        </div>

        <div className="space-y-2">
          {loadingContacts ? (
            <p className="text-sm text-muted">Loading contacts...</p>
          ) : contacts.length === 0 ? (
            <p className="text-sm text-muted">No contacts available.</p>
          ) : (
            contacts.map((contact) => {
              const active = selectedContact?.id === contact.id;
              return (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full text-left rounded-3xl px-4 py-3 transition ${
                    active ? "bg-accent-primary/10 text-accent-primary" : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{contact.fullName}</p>
                      <p className="text-sm text-muted">{contact.role}</p>
                    </div>
                    <span className="text-xs text-muted">{contact.email}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="glass-card rounded-3xl border border-[var(--border)] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold">{selectedContact ? selectedContact.fullName : "Select a contact"}</h1>
              <p className="text-sm text-muted">
                {selectedContact
                  ? `Conversation with ${selectedContact.fullName}`
                  : "Choose a contact to start your conversation."}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-muted">
              <Users className="w-4 h-4" />
              {contacts.length} contacts
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl border border-[var(--border)] p-6 flex-1 flex flex-col">
          {error && <p className="text-sm text-danger mb-3">{error}</p>}
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide min-h-[280px]">
            {loadingConversation ? (
              <p className="text-sm text-muted">Loading messages...</p>
            ) : !selectedContact ? (
              <p className="text-sm text-muted">Pick a conversation to begin.</p>
            ) : sortedMessages.length === 0 ? (
              <p className="text-sm text-muted">No messages yet. Send the first one.</p>
            ) : (
              sortedMessages.map((message) => {
                const isSender = message.senderId === selectedContact.id ? false : true;
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[85%] ${isSender ? "ml-auto bg-accent-primary/10 text-white" : "bg-white/5 text-muted"} rounded-3xl px-4 py-3`}
                  >
                    <p>{message.content}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </motion.div>
                );
              })
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a message..."
              disabled={!selectedContact}
              className="min-w-0 flex-1 rounded-3xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-accent-primary/50"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!selectedContact || !draft.trim()}
              className="inline-flex items-center justify-center rounded-3xl bg-accent-gradient px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
