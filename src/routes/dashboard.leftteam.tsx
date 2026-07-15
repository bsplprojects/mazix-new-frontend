import { useState } from "react";
import { PageHeader, StatCard } from "@/components/dashboard-ui";
import { Users, ArrowLeftRight, UserPlus } from "lucide-react";
import { teamApi } from "@/services/teamApi";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useDebounce } from "use-debounce";
import { Skeleton } from "@/components/ui/skeleton";

type Member = {
  id: string;
  name: string;
  bv: number;
  active?: boolean;
  rank?: string;
  repurchaseBV: number;
  joinDate: Date;
};

export default function Team() {
  const [members, setMembers] = useState<Member[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalBV: 0,
  });
  const [debouncedSearch] = useDebounce(search, 500);

  const userId = sessionStorage.getItem("memberID");

  const { isLoading } = useQuery({
    queryKey: ["team", userId, debouncedSearch],
    queryFn: async () => {
      const res = await teamApi.left(userId as string, null, debouncedSearch);
      console.log(res);
      setMembers(Array.isArray(res?.members) ? res?.members : []);
      setCursor(res.nextCursor);
      return res;
    },
  });

  const { isLoading: statsLoading } = useQuery({
    queryKey: ["team", userId],
    queryFn: async () => {
      const res = await teamApi.stats(userId as string, "left");
      setStats(res?.stats);
      return res;
    },
  });

  const loadMore = async () => {
    if (!cursor) return;
    setLoading(true);
    const res = await teamApi.left(userId as string, cursor, debouncedSearch);
    setMembers((prev) => [...prev, ...res.members]);
    setCursor(res.nextCursor);
    setLoading(false);
  };

  const joiningBV = members.length
    ? members.reduce((acc, b) => acc + b.bv, 0)
    : 0;

  const repurchaseBV = members.length
    ? members.reduce((acc, b) => acc + b.repurchaseBV, 0)
    : 0;

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
        subtitle="Overview of your ORG 1 leg performance and member distribution"
      />

      {/* STATS */}

      {statsLoading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n: number) => (
            <Skeleton key={n} className="h-28" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard
            label="Total"
            value={stats.total.toLocaleString("en-IN")}
            icon={<Users />}
          />
          <StatCard
            label="Total BV"
            value={stats.totalBV.toLocaleString("en-IN")}
            icon={<ArrowLeftRight />}
          />
          <StatCard
            label="Active"
            value={stats.active.toLocaleString("en-IN")}
            icon={<UserPlus />}
          />
        </div>
      )}

      {/* SEARCH */}
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
          <span>ORG 1 Members</span>
          <div className="flex gap-5">
            <p>Repurchase BV : {repurchaseBV}</p>
            <p>Joining BV : {joiningBV}</p>
          </div>
        </div>

        <table className="min-w-175 w-full border">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
            <tr>
              <th className="text-left px-6 py-3">#</th>
              <th className="text-left px-6 py-3">Member Name</th>
              <th className="text-left px-6 py-3">Member ID</th>
              <th className="text-left px-6 py-3">joiningDate</th>
              <th className="text-left px-6 py-3">BV</th>
              <th className="text-left px-6 py-3">Rank</th>
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
              members.map((m, index: number) => (
                <tr
                  key={m.id}
                  className="hover:bg-accent/30 transition-smooth text-xs"
                >
                  <td className="text-left px-6 py-3">{index + 1}</td>
                  <td className="text-left px-6 py-3 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold bg-amber-600 text-white">
                      {m.name
                        ?.split(" ")
                        .map((n) => n?.[0] || "")
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <span className="text-xs">{m.name}</span>
                  </td>

                  <td className="text-left px-6 py-3">{m.id}</td>
                  <td className="text-left px-6 py-3">
                    {new Date(m?.joinDate).toLocaleDateString("en-IN")}
                  </td>

                  <td className="text-left px-6 py-3">
                    {m.bv?.toLocaleString("en-IN")}
                  </td>

                  <td className="text-left px-6 py-3">{m.rank || "-"}</td>
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
