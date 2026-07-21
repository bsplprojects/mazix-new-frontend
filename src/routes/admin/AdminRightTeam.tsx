import { useState } from "react";
import { PageHeader, StatCard } from "@/components/dashboard-ui";
import { Users, ArrowLeftRight, UserPlus, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useDebounce } from "use-debounce";
import { axiosInstance } from "@/config/axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type Member = {
  id: string;
  name: string;
  bv: number;
  active?: boolean;
  rank?: string;
  repurchaseBV: number;
  joinDate: Date;
};

export default function AdminRightTeam() {
  const [members, setMembers] = useState<Member[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [userId, setUserId] = useState("");

  const { isLoading, refetch } = useQuery({
    queryKey: ["team", userId, debouncedSearch],
    queryFn: async () => {
      const res = await axiosInstance.post(`/team/left/${userId}`, {
        search: debouncedSearch,
        queue: cursor,
        limit: 10,
      });

      setMembers(Array.isArray(res.data?.members) ? res.data?.members : []);
      setCursor(res.data?.nextCursor);
      return res;
    },
    enabled: false,
  });

  const loadMore = async () => {
    if (!cursor) return;
    setLoading(true);
    const res = await axiosInstance.post(`/team/left/${userId}`, {
      search: debouncedSearch,
      queue: null,
      limit: 100,
    });

    const members = Array.isArray(res.data?.members) ? res.data?.members : [];

    setMembers((prev) => [...prev, ...members]);
    setCursor(res.data?.nextCursor);
    setLoading(false);
  };

  const loadAll = async () => {
    setLoading(true);
    setMembers([]);

    try {
      let nextCursor: string | null = null;

      while (true) {
        const res = await axiosInstance.post(`/team/left/${userId}`, {
          search: debouncedSearch,
          queue: nextCursor,
          limit: 100,
        });

        const members = Array.isArray(res.data?.members)
          ? res.data?.members
          : [];

        setMembers((prev) => [...prev, ...members]);

        if (!res.data?.nextCursor) {
          setCursor(null);
          break;
        }

        nextCursor = res.data?.nextCursor;
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } finally {
      setLoading(false);
    }
  };

  const joiningBV = members.length
    ? members.filter((m) => m.rank).reduce((acc, b) => acc + b.bv, 0)
    : 0;

  const repurchaseBV = members.length
    ? members.filter((m) => m.rank).reduce((acc, b) => acc + b.repurchaseBV, 0)
    : 0;

  const totalMembers = members.length
    ? members.filter((m) => m.rank).length
    : 0;

  const activeMembers = members.length
    ? members.filter((m) => m.rank).filter((m) => m.active).length
    : 0;

  const handleExcel = () => {
    if (!members || members.length === 0) {
      alert("No members found");
      return;
    }
    const excelData = members.map((user: any, index: number) => ({
      "Sr.": index + 1,
      "Member ID": user?.id ?? "-",
      Member: user?.name ?? "-",
      "Joining Date":
        new Date(user?.joinDate).toLocaleDateString("en-IN") ?? "-",
      BV: user?.bv ?? "-",
      "Repurchase BV": user?.repurchaseBV ?? "-",
      Rank: user?.rank ?? "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 15 },
      { wch: 18 },
      { wch: 30 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 10 },
      { wch: 20 },
      { wch: 20 },
      { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "ORG 1 Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Sale_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
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
        <StatCard label="Total" value={totalMembers} icon={<Users />} />
        <StatCard
          label="Total BV"
          value={joiningBV + repurchaseBV}
          icon={<ArrowLeftRight />}
        />
        <StatCard label="Active" value={activeMembers} icon={<UserPlus />} />
      </div>

      <div className="flex items-end gap-2">
        <div className="space-y-2 w-1/5">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Member ID
          </label>

          <div className="relative">
            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />

            <Input
              placeholder="RMG1001"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="rounded-2xl border border-white/10 bg-zinc-900/80 pl-10 text-white placeholder:text-zinc-500 focus:border-yellow-500"
            />
          </div>
        </div>

        <Button disabled={!userId || isLoading} onClick={() => refetch()}>
          Display
        </Button>
        <Button variant={"default"} onClick={handleExcel}>
          <Download /> Excel
        </Button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-3">
        <Input
          type="text"
          placeholder="Search by Name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={loadAll} disabled={loading || !cursor}>
          {loading ? "Loading..." : cursor ? "All Members" : "No More Members"}
        </Button>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-x-auto">
        <div className="px-4 py-3 border-b font-semibold flex justify-between">
          <span>ORG 2 Members</span>
          <div className="flex gap-5">
            <p>Repurchase BV : {repurchaseBV ?? 0}</p>
            <p>Joining BV : {joiningBV ?? 0}</p>
          </div>
        </div>

        <table className="min-w-175 w-full border">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40 text-nowrap">
            <tr>
              <th className="text-left px-6 py-3">#</th>
              <th className="text-left px-6 py-3">Member Name</th>
              <th className="text-left px-6 py-3">Member ID</th>
              <th className="text-left px-6 py-3">joiningDate</th>
              <th className="text-left px-6 py-3">BV</th>
              <th className="text-left px-6 py-3">Repurchase BV</th>
              <th className="text-left px-6 py-3">Rank</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {members.filter((m) => m.rank).length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-500">
                  No results found
                </td>
              </tr>
            ) : (
              members
                .filter((m) => m?.rank)
                .map((m, index: number) => (
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

                    <td className="text-left px-6 py-3">
                      {m.repurchaseBV?.toLocaleString("en-IN")}
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
