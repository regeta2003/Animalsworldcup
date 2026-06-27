import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { submitContact } from "@/lib/client";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("sending");
    setError("");
    try {
      await submitContact({ name: name.trim(), email: email.trim(), message: message.trim() });
      setStatus("sent");
      setName(""); setEmail(""); setMessage("");
    } catch (e: any) {
      setStatus("error");
      setError(e?.message || "Could not send your message");
    }
  };

  return (
    <section id="contact" className="relative card-surface rounded-3xl overflow-hidden p-4 sm:p-5 border border-gold/30 flex flex-col h-full scroll-mt-24 shadow-[0_2px_8px_rgba(17,22,31,0.05),0_20px_48px_-20px_rgba(17,22,31,0.18)]">
      <h3 className="headline text-lg mb-3 text-center">Contact</h3>
      <form onSubmit={submit} className="flex-1 flex flex-col gap-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <input
            value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required
            className="rounded-xl border border-border bg-soft px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold"
          />
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="rounded-xl border border-border bg-soft px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <textarea
          value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" required rows={4}
          className="flex-1 resize-none rounded-xl border border-border bg-soft px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold"
        />
        {status === "error" && <p className="text-xs text-live">{error}</p>}
        {status === "sent" && (
          <p className="text-xs text-pitch flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Message sent — thanks!</p>
        )}
        <button
          type="submit" disabled={status === "sending"}
          className="w-full inline-flex items-center justify-center gap-1.5 bg-gold text-gold-foreground py-2 rounded-xl font-display font-bold uppercase tracking-wider text-xs hover:brightness-95 transition disabled:opacity-60"
        >
          {status === "sending" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Send Message"}
        </button>
      </form>
    </section>
  );
}
