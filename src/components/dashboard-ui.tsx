import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
      <div>
        <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  tone = "emerald",
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: "emerald" | "brass";
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-card border border-border/60 p-5 shadow-card transition-smooth hover:border-primary/40 hover:shadow-glow group">
      <div
        className={cn(
          "absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-20 blur-2xl transition-smooth group-hover:opacity-40",
          tone === "emerald" ? "bg-primary" : "bg-brass",
        )}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          {icon && (
            <div
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center",
                tone === "emerald"
                  ? "bg-primary/10 text-primary"
                  : "bg-brass/10 text-brass ",
              )}
            >
              {icon}
            </div>
          )}
        </div>
        <div className="font-display text-3xl">{value}</div>
        {delta && (
          <div
            className={cn(
              "text-xs mt-2",
              tone === "emerald" ? "text-primary" : "text-brass",
            )}
          >
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}
