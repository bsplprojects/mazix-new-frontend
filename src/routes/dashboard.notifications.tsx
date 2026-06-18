import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { notifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/notifications")({
  component: Notifications,
});

function Notifications() {
  return (
    <div className="space-y-6 max-w-[900px] mx-auto">
      <PageHeader
        title="Notifications"
        subtitle="Updates from your network and account"
        action={
          <Button variant="outline" size="sm">
            <CheckCheck className="mr-2 h-4 w-4" /> Mark all read
          </Button>
        }
      />

      <div className="rounded-2xl bg-gradient-card border border-border/60 shadow-card divide-y divide-border overflow-hidden">
        {[...notifications, ...notifications].map((n, i) => (
          <div key={i} className="p-5 flex gap-4 hover:bg-accent/30 transition-smooth">
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                n.type === "success"
                  ? "bg-primary/10 text-primary"
                  : n.type === "warning"
                    ? "bg-brass/10 text-brass"
                    : "bg-secondary text-muted-foreground",
              )}
            >
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-4">
                <div className="font-medium">{n.title}</div>
                <div className="text-xs text-muted-foreground shrink-0">{n.time}</div>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{n.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
