import { Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard-ui";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { teamApi } from "@/services/teamApi";

export default function DirectTeam() {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<any[]>([]);

  /* ✅ API CALL */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await teamApi.direct("MAZ094982");
        console.log("Direct:", data);

        setMembers(data); // 👈 STORE IN STATE
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  /* ✅ SEARCH FILTER */
  const filtered = members
    .filter((m) =>
      `${m.name} ${m.id} ${m.rank}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .sort(
      (a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime(),
    );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Direct Team"
        subtitle="View all your directly sponsored members"
      />

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID, name or rank…"
          className="h-12 pl-11 bg-input border-border"
        />
      </div>

      {/* TABLE */}
      <div className="rounded-2xl bg-gradient-card border border-border/60 shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
            <tr>
              <th className="text-left px-6 py-3">Member</th>
              <th className="text-left px-6 py-3">Member ID</th>
              <th className="text-left px-6 py-3">Joining</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-accent/30 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-emerald text-primary-foreground flex items-center justify-center text-xs font-semibold">
                      {m.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <span className="font-medium">{m.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  {m.id}
                </td>

                <td className="px-6 py-4 text-brass">
                  {new Date(m.joinDate).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
