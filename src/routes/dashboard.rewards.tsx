import { useEffect, useState } from "react";
import { Trophy, Lock, Check } from "lucide-react";
import { PageHeader } from "@/components/dashboard-ui";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { rewardApi } from "@/services/rewardsApi";

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRewards = async () => {
    try {
      const MemberID = sessionStorage.getItem("memberID");

      const res = await rewardApi.rewards(MemberID as string);

      const apiData = res || [];

      const formatted = apiData.map((r) => {
        const requiredPair = Number(r.RequiredPV || 0);
        const achievedPair = Number(r.AchivePV || 0);

        const progress =
          requiredPair > 0
            ? Math.min(Math.round((achievedPair / requiredPair) * 100), 100)
            : 0;

        return {
          tier: r.RewardName,
          target: `${requiredPair} Pair · ₹${Number(
            r.AchiveBV || 0,
          ).toLocaleString()}`,
          reward: r.Reward,
          achieved: r.Status === "Achieved",
          progress,
        };
      });

      setRewards(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
  }, []);

  const achieved = rewards.filter((r) => r.achieved).length;

  const currentReward =
    rewards.length > 0
      ? [...rewards].reverse().find((r) => r.achieved) || rewards[0]
      : null;

  const currentIndex = rewards.findIndex(
    (r) => r?.tier === currentReward?.tier,
  );

  const nextReward = rewards[currentIndex + 1];

  const progressValue = nextReward?.progress || 0;

  if (loading)
    return (
      <div className="space-y-8 max-w-[1400px] mx-auto animate-pulse">
        {/* HEADER */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded-md" />
          <div className="h-4 w-96 bg-muted rounded-md" />
        </div>

        {/* TOP CARD SKELETON */}
        <div className="rounded-2xl border border-border/60 p-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="h-3 w-32 bg-muted rounded" />
              <div className="h-10 w-48 bg-muted rounded" />
              <div className="h-3 w-36 bg-muted rounded" />
            </div>

            <div className="space-y-3">
              <div className="h-3 w-32 bg-muted rounded" />
              <div className="h-10 w-40 bg-muted rounded" />
              <div className="h-3 w-36 bg-muted rounded" />
            </div>

            <div className="space-y-3">
              <div className="h-3 w-32 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
          </div>
        </div>

        {/* REWARD LIST SKELETON */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border p-5 flex items-center gap-5"
            >
              <div className="h-14 w-14 bg-muted rounded-xl" />

              <div className="flex-1 grid md:grid-cols-3 gap-4">
                <div className="h-6 bg-muted rounded" />
                <div className="h-6 bg-muted rounded" />
                <div className="h-6 bg-muted rounded" />
              </div>

              <div className="w-24 h-4 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-8 max-w-350 mx-auto">
      <PageHeader
        title="Reward Ladder"
        subtitle={`${achieved} of ${rewards.length} milestones achieved`}
      />

      {/* TOP CARD */}
      {currentReward && (
        <div className="rounded-2xl bg-gradient-hero border border-border/60 p-8 shadow-elegant relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-emerald opacity-50" />

          <div className="relative grid md:grid-cols-3 gap-6">
            {/* CURRENT */}
            <div>
              <div className="text-xs uppercase tracking-wider text-brass mb-2">
                Current Reward Tier
              </div>

              <div className="font-display text-4xl text-gradient-emerald">
                {currentReward.tier}
              </div>

              <div className="text-sm text-muted-foreground mt-2">
                {currentReward.reward}
              </div>
            </div>

            {/* NEXT */}
            <div>
              <div className="text-xs uppercase tracking-wider text-brass mb-2">
                Next Reward
              </div>

              <div className="font-display text-4xl">
                {nextReward?.tier || "Completed"}
              </div>

              <div className="text-sm text-muted-foreground mt-2">
                {nextReward?.reward || "All rewards achieved"}
              </div>
            </div>

            {/* PROGRESS */}
            <div>
              <div className="text-xs uppercase tracking-wider text-brass mb-2">
                Progress to Next Reward
              </div>

              <Progress
                value={progressValue}
                className="h-3 bg-secondary mt-3"
              />

              <div className="text-sm mt-2">
                <span className="text-gradient-brass font-display text-xl">
                  {progressValue}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REWARD LIST */}
      <div className="space-y-3">
        {rewards.map((r, i) => (
          <div
            key={r.tier}
            className={cn(
              "rounded-xl border p-5 flex md:flex-row flex-col items-start md:items-center gap-5 transition-smooth",
              r.achieved
                ? "bg-gradient-card border-primary/30 shadow-card"
                : "bg-card/30 border-border/60 hover:border-border",
            )}
          >
            {/* ICON */}
            <div
              className={cn(
                "h-14 w-14 rounded-xl flex items-center justify-center shrink-0",
                r.achieved
                  ? "bg-gradient-emerald shadow-glow text-primary-foreground"
                  : r.progress
                    ? "bg-brass/10 text-brass"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {r.achieved ? (
                <Check className="h-6 w-6" />
              ) : r.progress ? (
                <Trophy className="h-6 w-6" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </div>

            {/* CONTENT */}
            <div className="flex-1 grid md:grid-cols-3 gap-4 items-center">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Tier {i + 1}
                </div>
                <div className="font-display text-xl">{r.tier}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Target Bonus
                </div>
                <div className="text-sm font-mono">{r.target}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Reward
                </div>
                <div className="text-sm text-gradient-brass font-medium">
                  {r.reward}
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div className="w-32 text-right shrink-0">
              {r.achieved ? (
                <span className="text-xs font-medium text-primary">
                  Achieved ✓
                </span>
              ) : r.progress ? (
                <>
                  <div className="text-xs text-muted-foreground mb-1">
                    {r.progress}%
                  </div>
                  <Progress value={r.progress} className="h-1.5 bg-secondary" />
                </>
              ) : (
                <span className="text-xs text-muted-foreground">Locked</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
