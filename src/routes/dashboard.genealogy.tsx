import { Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard-ui";
import { Input } from "@/components/ui/input";
import { binaryTree, type TreeNode } from "@/lib/mock-data";

type Leg = "L" | "R" | "";
function flatten(
  node: TreeNode,
  level = 0,
  leg: Leg = "",
): Array<TreeNode & { level: number; leg: Leg }> {
  const acc: Array<TreeNode & { level: number; leg: Leg }> = [
    { ...node, level, leg },
  ];
  if (node.left)
    acc.push(...flatten(node.left, level + 1, (leg || "L") as Leg));
  if (node.right)
    acc.push(...flatten(node.right, level + 1, (leg || "R") as Leg));
  return acc;
}

export default function Genealogy() {
  const all = flatten(binaryTree);
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Genealogy Search"
        subtitle="Find any member in your downline by ID, name or rank"
      />

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by ID, name or rank…"
          className="h-12 pl-11 bg-input border-border"
        />
      </div>

      <div className="rounded-2xl bg-gradient-card border border-border/60 shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
            <tr>
              <th className="text-left px-6 py-3">Member</th>
              <th className="text-left px-6 py-3">ID</th>
              <th className="text-left px-6 py-3">Rank</th>
              <th className="text-left px-6 py-3">Leg</th>
              <th className="text-left px-6 py-3">Level</th>
              <th className="text-right px-6 py-3">BV</th>
              <th className="text-right px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {all.map((m) => (
              <tr key={m.id} className="hover:bg-accent/30 transition-smooth">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-emerald text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">
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
                <td className="px-6 py-4">
                  <span className="text-brass">{m.rank}</span>
                </td>
                <td className="px-6 py-4">
                  {m.leg ? (
                    m.leg === "L" ? (
                      "Left"
                    ) : (
                      "Right"
                    )
                  ) : (
                    <span className="text-primary">Root</span>
                  )}
                </td>
                <td className="px-6 py-4 text-muted-foreground">L{m.level}</td>
                <td className="px-6 py-4 text-right font-mono">
                  {m.bv.toLocaleString("en-IN")}
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs ${m.active ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${m.active ? "bg-primary" : "bg-muted-foreground"}`}
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
