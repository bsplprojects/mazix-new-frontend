import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { PageHeader, StatCard } from "@/components/dashboard-ui";
import { Users, UserPlus, Activity, ArrowLeftRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { teamApi } from "@/services/teamApi";
import { cn } from "@/lib/utils";

function flatten(node: TreeNode): TreeNode[] {
  const acc: TreeNode[] = [];
  const visited = new Set<string>();

  function dfs(n: TreeNode | null) {
    if (!n || visited.has(n.id)) return;

    visited.add(n.id);
    acc.push(n);

    dfs(n.left);
    dfs(n.right);
  }

  dfs(node);
  return acc;
}
const growthData: Record<
  "left" | "right",
  Array<{ week: string; joins: number; active: number }>
> = {
  left: [
    { week: "W1", joins: 4, active: 78 },
    { week: "W2", joins: 6, active: 86 },
    { week: "W3", joins: 7, active: 98 },
    { week: "W4", joins: 9, active: 112 },
  ],
  right: [
    { week: "W1", joins: 2, active: 64 },
    { week: "W2", joins: 3, active: 70 },
    { week: "W3", joins: 5, active: 80 },
    { week: "W4", joins: 6, active: 86 },
  ],
};

type Leg = "left" | "right";

function LegPanel({
  leg,
  root,
  loading,
}: {
  leg: Leg;
  root: TreeNode;
  loading: boolean;
}) {
  const subtree = leg === "left" ? root.left : root.right;
  const allMembers = subtree ? flatten(subtree) : [];
  const members = allMembers;
  const total = members.length;
  const active = allMembers.filter((m) => m.active).length;
  const totalBV = flatten(subtree).reduce((s, m) => s + m.bv, 0);
  const top = [...members].sort((a, b) => b.bv - a.bv).slice(0, 6);
  const data = growthData[leg];
  const accent = leg === "left" ? "emerald" : "brass";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Loading Team...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          label={`${leg === "left" ? "Left" : "Right"} Members`}
          value={total.toLocaleString("en-IN")}
          delta="All levels"
          tone={accent}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Active"
          value={active.toLocaleString("en-IN")}
          delta={`${total ? Math.round((active / total) * 100) : 0}% activity`}
          tone={accent}
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          label="Leg BV"
          value={totalBV.toLocaleString("en-IN")}
          delta="Cumulative"
          tone={accent}
          icon={<ArrowLeftRight className="h-4 w-4" />}
        />
        <StatCard
          label="New This Month"
          value={leg === "left" ? "26" : "16"}
          delta="Joined recently"
          tone={accent}
          icon={<UserPlus className="h-4 w-4" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <h2 className="font-display text-xl mb-1">
            {leg === "left" ? "Left Leg" : "Right Leg"} Growth
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            Weekly joins and active members
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(1 0 0 / 0.05)"
              />
              <XAxis
                dataKey="week"
                stroke="oklch(0.68 0.02 160)"
                fontSize={11}
              />
              <YAxis stroke="oklch(0.68 0.02 160)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.20 0.014 170)",
                  border: "1px solid oklch(0.30 0.014 170)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="joins"
                fill={
                  leg === "left"
                    ? "oklch(0.62 0.14 158)"
                    : "oklch(0.78 0.12 80)"
                }
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="active"
                fill={
                  leg === "left"
                    ? "oklch(0.78 0.12 80)"
                    : "oklch(0.62 0.14 158)"
                }
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <h2 className="font-display text-xl mb-1">Top Performers</h2>
          <p className="text-xs text-muted-foreground mb-4">
            {leg === "left" ? "Left" : "Right"} leg by BV
          </p>
          <div className="space-y-3">
            {top.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No members on this leg yet.
              </p>
            )}
            {top.map((m, i) => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="font-display text-lg w-6 text-brass">
                  {i + 1}
                </div>
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-primary-foreground",
                    leg === "left" ? "bg-gradient-emerald" : "bg-brass",
                  )}
                >
                  {m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="text-[10px] text-brass uppercase tracking-wider">
                    {m.rank}
                  </div>
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  {(m.bv / 1000).toFixed(0)}K
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
          <h2 className="font-display text-lg">
            {leg === "left" ? "Left" : "Right"} Leg Members
          </h2>
          <span className="text-xs text-muted-foreground">
            {members.length} total
          </span>
        </div>
        <table className="min-w-[700px] w-full border">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
            <tr>
              <th className="text-left px-6 py-3">Member</th>
              <th className="text-left px-6 py-3">ID</th>
              <th className="text-left px-6 py-3">Rank</th>
              <th className="text-right px-6 py-3">BV</th>
              <th className="text-right px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-accent/30 transition-smooth">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-primary-foreground shrink-0",
                        leg === "left" ? "bg-gradient-emerald" : "bg-brass",
                      )}
                    >
                      {m.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <span className="font-medium">{m.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  {m.id}
                </td>
                <td className="px-6 py-4 text-brass">{m.rank}</td>
                <td className="px-6 py-4 text-right font-mono">
                  {m.bv.toLocaleString("en-IN")}
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs",
                      m.active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        m.active ? "bg-primary" : "bg-muted-foreground",
                      )}
                    />
                    {m.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function buildTree(list: any[], rootId: string): TreeNode | null {
  if (!list?.length) return null;

  const map: Record<string, TreeNode> = {};

  // 1. Create all nodes first
  list.forEach((m) => {
    map[m.id] = {
      id: m.id,
      name: m.name,
      bv: Number(m.bv) || 0,
      active: m.active,
      rank: m.rank,
      left: null,
      right: null,
    };
  });

  let root: TreeNode | null = map[rootId] || null;

  // fallback if backend does not include root
  if (!root) {
    root = Object.values(map)[0] || null;
  }

  // 2. Link children
  list.forEach((m) => {
    const parent = map[m.placementId];
    const child = map[m.id];

    if (!parent) {
      console.warn("Missing parent:", m.id, m.placementId);
      return;
    }

    if (m.leg === "Left") {
      if (parent.left && parent.left.id !== child.id) {
        console.warn("Left overwrite:", parent.id);
      }
      parent.left = child;
    }

    if (m.leg === "Right") {
      if (parent.right && parent.right.id !== child.id) {
        console.warn("Right overwrite:", parent.id);
      }
      parent.right = child;
    }
  });

  return root;
}
export default function Team() {
  const [tab, setTab] = useState<Leg>("left");
  const [loading, setLoading] = useState(true);
  const [binaryTreeData, setBinaryTreeData] = useState<TreeNode>({
    id: "ROOT",
    name: "Loading...",
    bv: 0,
    active: true,
    rank: "Self",
    left: null,
    right: null,
  });

  const userId = "MAZ094982";

  useEffect(() => {
    async function loadTeam() {
      try {
        console.log("🚀 Loading Team Data...");

        setLoading(true);

        const [left, right] = await Promise.all([
          teamApi.left(userId),
          teamApi.right(userId),
        ]);

        console.log("✅ Left Team:", left.length);
        console.log("✅ Right Team:", right.length);

        const mergedMap = new Map();

        [...left, ...right].forEach((m) => {
          const existing = mergedMap.get(m.id);

          if (!existing) {
            mergedMap.set(m.id, m);
          } else {
            mergedMap.set(m.id, {
              ...existing,
              ...m,
            });
          }
        });

        mergedMap.set(userId, {
          id: userId,
          name: "You",
          bv: 0,
          active: true,
          rank: "Self",
          placementId: null,
          leg: null,
          left: null,
          right: null,
        });

        const merged = Array.from(mergedMap.values());

        const tree = buildTree(merged, userId);

        console.log("🌳 Final Tree:", tree);

        setBinaryTreeData(tree);
      } catch (err) {
        console.error("❌ TEAM LOAD ERROR:", err);
      } finally {
        setLoading(false);
        console.log("🏁 Loading Finished");
      }
    }

    loadTeam();
  }, []);

  const leftCount = binaryTreeData.left
    ? flatten(binaryTreeData.left).filter((n) => n.bv > 0).length
    : 0;

  const rightCount = binaryTreeData.right
    ? flatten(binaryTreeData.right).filter((n) => n.bv > 0).length
    : 0;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="Team Performance"
        subtitle="Split view of your left and right legs"
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as Leg)}>
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="left" className="gap-2">
            Left Leg{" "}
            <span className="text-xs text-muted-foreground">({leftCount})</span>
          </TabsTrigger>

          <TabsTrigger value="right" className="gap-2">
            Right Leg{" "}
            <span className="text-xs text-muted-foreground">
              ({rightCount})
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="left" className="mt-6">
          <LegPanel leg="left" root={binaryTreeData} loading={loading} />
        </TabsContent>

        <TabsContent value="right" className="mt-6">
          <LegPanel leg="right" root={binaryTreeData} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
