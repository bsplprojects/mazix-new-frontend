import { useState, useMemo } from "react";
import { PageHeader, StatCard } from "@/components/dashboard-ui";
import { Users, UserPlus, ArrowLeftRight } from "lucide-react";
import { teamApi } from "@/services/teamApi";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";

type Member = {
  id: string;
  name: string;
  bv: number;
  active?: boolean;
  rank?: string;
};

export default function Team() {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);

  const userId = "MAZ094982";

  const { isLoading } = useQuery({
    queryKey: ["team", userId, debouncedSearch],
    queryFn: async () => {
      const res = await teamApi.right(userId as string, null, debouncedSearch);
      setMembers(Array.isArray(res?.members) ? res?.members : []);
      setCursor(res.nextCursor);
      return res;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["team-stats", userId, "left"],
    queryFn: () => teamApi.stats(userId as string, "left"),
  });

  console.log(stats);

  const loadMore = async () => {
    if (!cursor) return;
    setLoading(true);
    const res = await teamApi.right(userId as string, cursor);

    setMembers((prev) => [...prev, ...res.members]);
    setCursor(res.nextCursor);
    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto space-y-8">
      <PageHeader
        title="Team Performance"
        subtitle="Overview of your ORG 2 leg performance and member distribution"
      />

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          label="Members"
          value={stats?.total.toLocaleString("en-IN") ?? 0}
          icon={<Users />}
        />
        <StatCard
          label="Leg BV"
          value={stats?.totalBV.toLocaleString("en-IN") ?? 0}
          icon={<ArrowLeftRight />}
        />
        {/* <StatCard label="New" value="26" icon={<UserPlus />} /> */}
      </div>

      <div className="flex items-center gap-3">
        <Input
          type="text"
          placeholder="Search by Name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-x-auto">
        <div className="px-4 py-3 border-b font-semibold flex justify-between">
          <span>ORG 2 Members</span>
        </div>

        <table className="min-w-175 w-full border">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
            <tr>
              <th className="text-left px-6 py-3">Member Name</th>
              <th className="text-left px-6 py-3">Member ID</th>
              <th className="text-left px-6 py-3">joiningDate</th>
              <th className="text-left px-6 py-3">BV</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {members.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-6 text-gray-500">
                  No results found
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="hover:bg-accent/30 transition-smooth">
                  <td className="p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold bg-amber-600 text-white">
                      {m.name
                        ?.split(" ")
                        .map((n) => n?.[0] || "")
                        .join("")
                        .slice(0, 2)}
                    </div>
                    {m.name}
                  </td>

                  <td className="p-3 font-mono text-xs">{m.id}</td>
                  <td className="p-3 font-mono text-xs">
                    {new Date(m.joinDate).toLocaleDateString("en-IN")}
                  </td>

                  <td className="p-3 ">{m.bv?.toLocaleString("en-IN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-center my-8">
        <Button onClick={loadMore} disabled={!cursor || loading}>
          {loading ? "Loading..." : cursor ? "Load More" : "No More Members"}
        </Button>
      </div>
    </div>
  );
}
