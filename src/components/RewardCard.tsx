import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import { rewardApi } from "@/services/rewardsApi";

interface RewardType {
  tier: string;
  target: string;
  reward: string;
  achieved: boolean;
  progress: number;
}

const RewardCard = () => {
  const [rewards, setRewards] = useState<RewardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [achPV, setAchPV] = useState(0);
  const [reqPV, setReqPV] = useState(0);

  const loadRewards = async () => {
    let achievedPVStat = 0;
    let requiredPVStat = 0;
    let index = 0;
    try {
      const MemberID = sessionStorage.getItem("memberID");

      const res = await rewardApi.rewards(MemberID as string);
      const apiData = res || [];

      let totalRequired = 0;
      const formatted = apiData.map((r) => {
        const requiredPair = Number(r.RequiredPV || 0);
        const achievedPair = Number(r.AchivePV || 0);
        achievedPVStat = achievedPair;

        if (requiredPair > 0) {
          totalRequired += requiredPair;
        }

        if (r.Status === "Achieved") {
          requiredPVStat += requiredPair;
          index++;
        }

        const progress =
          requiredPair > 0
            ? Math.min(Math.round((achievedPair / totalRequired) * 100), 100)
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

      requiredPVStat += Number(apiData[index]?.RequiredPV || 0);
      setReqPV(requiredPVStat);
      setAchPV(achievedPVStat);
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
  return (
    <div>
      {currentReward && (
        <div className="rounded-2xl bg-gradient-hero border border-border/60 p-8 shadow-elegant relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-emerald opacity-50" />

          <div className="relative grid md:grid-cols-5 gap-6">
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

            {/* CURRENT ACHIEVED PV */}
            <div>
              <div className="text-xs uppercase tracking-wider text-brass ">
                ACHIEVED PAIR
              </div>

              <div className="font-display text-xl text-gradient-emerald mb-2">
                {achPV}
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

            <div>
              <div className="text-xs text-nowrap uppercase tracking-wider text-brass ">
                Reward PV Required
              </div>

              <div className="font-display text-xl text-gradient-emerald">
                {reqPV - achPV}
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
    </div>
  );
};

export default RewardCard;
