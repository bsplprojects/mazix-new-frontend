import { useState, useEffect, useMemo } from "react";
import { PageHeader, StatCard } from "@/components/dashboard-ui";
import { Users, UserPlus, ArrowLeftRight } from "lucide-react";
import { teamApi } from "@/services/teamApi";

/* ---------------- TYPES ---------------- */

type Member = {
  id: string;
  name: string;
  bv: number;
  active?: boolean;
  rank?: string;
};

/* ---------------- CONSTANTS ---------------- */

const PAGE_SIZE = 10;

/* ---------------- COMPONENT ---------------- */

export default function Team() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const userId = "MAZ094982";

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const right = await teamApi.right(userId);

        setMembers(Array.isArray(right) ? right : []);
      } catch (err) {
        console.error("LOAD ERROR:", err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ---------------- FILTER ---------------- */

  const filteredMembers = useMemo(() => {
    if (!search.trim()) return members;

    const q = search.toLowerCase();

    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) || m.id?.toLowerCase().includes(q),
    );
  }, [members, search]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(filteredMembers.length / PAGE_SIZE);

  const paginatedMembers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredMembers.slice(start, start + PAGE_SIZE);
  }, [filteredMembers, page]);

  /* reset page when search changes */
  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ---------------- STATS ---------------- */

  const stats = useMemo(() => {
    const total = filteredMembers.length;
    const active = filteredMembers.filter((m) => m.active).length;
    const totalBV = filteredMembers.reduce((s, m) => s + (m.bv || 0), 0);

    return { total, active, totalBV };
  }, [filteredMembers]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <PageHeader
        title="Team Performance"
        subtitle="Overview of your right leg performance and member distribution"
      />

      {/* SEARCH */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by Name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-md"
        />
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          label="Members"
          value={stats.total.toLocaleString("en-IN")}
          icon={<Users />}
        />
        <StatCard
          label="Leg BV"
          value={stats.totalBV.toLocaleString("en-IN")}
          icon={<ArrowLeftRight />}
        />
        <StatCard label="New" value="26" icon={<UserPlus />} />
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-x-auto">
        <div className="px-4 py-3 border-b font-semibold flex justify-between">
          <span>right Members</span>
          <span className="text-xs text-muted-foreground">
            Page {page} / {totalPages || 1}
          </span>
        </div>

        <table className="min-w-[700px] w-full border">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
            <tr>
              <th className="text-right px-6 py-3">Member Name</th>
              <th className="text-right px-6 py-3">Member ID</th>
              <th className="text-right px-6 py-3">joiningDate</th>
              <th className="text-right px-6 py-3">BV</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {paginatedMembers.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-6 text-gray-500">
                  No results found
                </td>
              </tr>
            ) : (
              paginatedMembers.map((m) => (
                <tr key={m.id} className="hover:bg-accent/30 transition-smooth">
                  <td className="p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold bg-gradient-emerald text-white">
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
                    {new Date(m.joinDate).toLocaleString("en-IN")}
                  </td>

                  <td className="p-3 ">{m.bv?.toLocaleString("en-IN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex items-center justify-between p-4 border-t">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>

          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1} -{" "}
            {Math.min(page * PAGE_SIZE, filteredMembers.length)}
          </div>

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
