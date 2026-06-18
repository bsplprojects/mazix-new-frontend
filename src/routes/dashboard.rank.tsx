import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard-ui";
import { cn } from "@/lib/utils";
import { rewardApi } from "@/services/rewardsApi";

/* ============================
        PAGE
============================ */

export default function RankPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ============================
        FETCH DATA
  ============================ */

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const MemberID = localStorage.getItem("MemberID") || "MAZ094982";

      const res = await rewardApi.rewards(MemberID);

      setRewards(res || []);
    } catch (err) {
      console.error("Reward Fetch Error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ============================
        CALCULATIONS
  ============================ */

  const achievedIndex = useMemo(() => {
    return rewards.findLastIndex((r) => r.Status === "Achieved");
  }, [rewards]);

  const currentRank = achievedIndex >= 0 ? rewards[achievedIndex] : null;

  const nextRank = achievedIndex >= 0 ? rewards[achievedIndex + 1] : rewards[0];

  /* ============================
        LOADING
  ============================ */

  if (loading)
    return (
      <div className="space-y-8 max-w-[1400px] mx-auto animate-pulse">
        {/* HEADER */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded-md" />
          <div className="h-4 w-96 bg-muted rounded-md" />
        </div>

        {/* TOP CARD */}
        <div className="rounded-2xl border border-border/60 p-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* CURRENT */}
            <div className="space-y-3">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-10 w-40 bg-muted rounded" />
              <div className="h-3 w-32 bg-muted rounded" />
            </div>

            {/* QUALIFICATION */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>

            {/* NEXT */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-muted/60" />
          ))}
        </div>
      </div>
    );

  /* ============================
        EMPTY DATA
  ============================ */

  if (!rewards.length)
    return <div className="p-6 text-muted-foreground">No rewards found</div>;

  /* ============================
        UI
  ============================ */

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="Rank Advancement"
        subtitle="Your achievement journey"
      />

      {/* ================= TOP CARD ================= */}

      <div className="rounded-2xl bg-gradient-hero border border-border/60 p-8 shadow-elegant">
        <div className="grid md:grid-cols-3 gap-6">
          {/* CURRENT RANK */}
          <div>
            <div className="text-xs uppercase tracking-wider text-brass mb-2">
              Current Rank
            </div>

            <div className="font-display text-5xl text-gradient-emerald">
              {currentRank?.RewardName || "Not Started"}
            </div>

            <div className="text-sm text-muted-foreground mt-2">
              {currentRank ? "Achieved" : "Start your journey"}
            </div>
          </div>

          {/* QUALIFICATION */}
          <div className="space-y-2 text-sm">
            <div className="text-xs uppercase tracking-wider text-brass">
              Qualification
            </div>

            <Row
              label="Achieved PV"
              value={currentRank?.AchivePV ?? "0"}
              pass
            />

            <Row
              label="Required PV"
              value={currentRank?.RequiredPV ?? "0"}
              pass
            />

            <Row
              label="Achieved BV"
              value={currentRank?.AchiveBV ?? "0"}
              pass
            />
          </div>

          {/* NEXT RANK */}
          <div className="space-y-2 text-sm">
            <div className="text-xs uppercase tracking-wider text-brass">
              Next Rank: {nextRank?.RewardName || "Completed"}
            </div>

            {nextRank ? (
              <>
                <Row label="Required PV" value={nextRank.RequiredPV} />

                <Row label="Reward" value={nextRank.Reward} />

                <Row label="Status" value={nextRank.Status} />
              </>
            ) : (
              <div className="text-muted-foreground">
                🎉 All ranks completed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= TIMELINE ================= */}

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />

        <div className="space-y-4">
          {rewards.map((r, i) => {
            const achieved = r.Status === "Achieved";
            const current = i === achievedIndex;

            return (
              <div
                key={r.RewardName}
                className={cn(
                  "relative md:grid md:grid-cols-2 gap-8 items-center",
                  i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2",
                )}
              >
                {/* CARD */}
                <div
                  className={cn(
                    "md:text-right p-4",
                    i % 2 === 1 && "md:text-left",
                  )}
                >
                  <div
                    className={cn(
                      "inline-block rounded-xl border px-5 py-3 transition-all",
                      current
                        ? "bg-gradient-emerald border-primary text-primary-foreground shadow-glow"
                        : achieved
                          ? "bg-gradient-card border-primary/30"
                          : "bg-card/40 border-border/60 text-muted-foreground",
                    )}
                  >
                    <div className="text-[10px] uppercase opacity-80">
                      Rank {i + 1}
                    </div>

                    <div className="font-display text-2xl">{r.RewardName}</div>

                    <div className="text-xs opacity-70">{r.Reward}</div>

                    {current && (
                      <div className="text-xs mt-1">★ Current Rank</div>
                    )}
                  </div>
                </div>

                {/* DOT */}
                <div className="hidden md:flex justify-center">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2 bg-background",
                      current
                        ? "border-primary shadow-glow"
                        : achieved
                          ? "border-primary"
                          : "border-border",
                    )}
                  >
                    {achieved && (
                      <div className="h-full w-full rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================
        ROW COMPONENT
============================ */

function Row({
  label,
  value,
  pass,
}: {
  label: string;
  value: any;
  pass?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>

      <span
        className={cn(
          "font-mono text-xs flex items-center gap-1.5",
          pass && "text-primary",
        )}
      >
        {pass && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
        {value}
      </span>
    </div>
  );
}
