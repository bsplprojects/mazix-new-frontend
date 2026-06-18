import { LifeBuoy, MessageCircle, Mail, Phone, FileText } from "lucide-react";
import { PageHeader } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Support() {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <PageHeader
        title="Support Center"
        subtitle="We're here to help you grow your network"
      />

      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            icon: MessageCircle,
            title: "Live Chat",
            desc: "Avg response 2 min",
            cta: "Start chat",
          },
          {
            icon: Mail,
            title: "Email",
            desc: "support@mazix.com",
            cta: "Send email",
          },
          {
            icon: Phone,
            title: "Call",
            desc: "Mon–Sat · 10am–7pm IST",
            cta: "Call now",
          },
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card text-center"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-emerald shadow-glow text-primary-foreground flex items-center justify-center mx-auto mb-4">
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
            <Button variant="outline" size="sm" className="mt-4 border-border">
              {c.cta}
            </Button>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <h2 className="font-display text-xl mb-1">Open a Ticket</h2>
          <p className="text-xs text-muted-foreground mb-5">
            Avg resolution time: 4 hours
          </p>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                className="bg-input border-border"
                placeholder="Briefly describe your issue"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select className="w-full h-10 rounded-md bg-input border border-border px-3 text-sm">
                <option>Wallet & Withdrawal</option>
                <option>Binary & Genealogy</option>
                <option>Rank Qualification</option>
                <option>Repurchase</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea className="bg-input border-border min-h-[120px]" />
            </div>
            <Button className="w-full bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90">
              <LifeBuoy className="mr-2 h-4 w-4" /> Submit Ticket
            </Button>
          </form>
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <h2 className="font-display text-xl mb-1">Knowledge Base</h2>
          <p className="text-xs text-muted-foreground mb-5">
            Most-viewed guides
          </p>
          <div className="space-y-2">
            {[
              "Understanding the Binary Compensation Plan",
              "How to qualify for monthly Repurchase bonuses",
              "Reaching Crown Diamond — full requirements",
              "Withdrawal limits, KYC and processing time",
              "Building a balanced left & right leg",
            ].map((q) => (
              <button
                key={q}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/40 border border-transparent hover:border-border transition-smooth text-left"
              >
                <FileText className="h-4 w-4 text-brass shrink-0" />
                <span className="text-sm">{q}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
