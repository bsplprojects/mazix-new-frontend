import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { PageHeader, StatCard } from "@/components/dashboard-ui";
import { teamApi } from "@/services/teamApi";

export default function MyPayout() {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const memberId = sessionStorage.getItem("memberID");

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await teamApi.myincome({
          fromDate,
          toDate,
          id: memberId as string,
          page,
          pageSize,
        });

        setData(res?.items || []);
        setTotalPages(res?.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fromDate, toDate, search, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [fromDate, toDate, search, pageSize]);

  const summary = useMemo(() => {
    const totalIncome = data.reduce(
      (sum, item) => sum + Number(item.Amount || 0),
      0,
    );

    const totalTds = data.reduce((sum, item) => sum + Number(item.TDS || 0), 0);

    return {
      totalIncome,
      totalTds,
      netPay: totalIncome - totalTds,
    };
  }, [data]);

  return (
    <div className="space-y-6 max-w-350 mx-auto">
      <PageHeader title="Old Income" subtitle="Payout history with summary" />

      {/* ================= SUMMARY + STAT CARD ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Income"
          value={`₹ ${summary.totalIncome.toLocaleString("en-IN")}`}
          delta="All credited income"
          tone="emerald"
          icon={<span className="text-emerald-500">₹</span>}
        />

        <StatCard
          label="Total TDS"
          value={`₹ ${summary.totalTds.toLocaleString("en-IN")}`}
          delta="Tax deduction"
          tone="red"
          icon={<span className="text-red-500">₹</span>}
        />

        <StatCard
          label="Net Pay"
          value={`₹ ${summary.netPay.toLocaleString("en-IN")}`}
          delta="After deduction"
          tone="blue"
          icon={<span className="text-blue-500">₹</span>}
        />
      </div>

      <div className="rounded-2xl border bg-card shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* From Date */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              From Date
            </label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-11"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              To Date
            </label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Page Size */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Rows per page
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>

          {/* Spacer for alignment */}
          <div className="hidden md:block" />

          {/* Info badge / optional button */}
          <div className="flex items-center justify-end">
            <div className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-xl">
              Filter applied automatically
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            {/* HEADER */}
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Payout Date</th>

                <th className="px-5 py-3 text-left">Cur Left</th>
                <th className="px-5 py-3 text-left">Cur Right</th>

                <th className="px-5 py-3 text-left">Old Cur Left</th>
                <th className="px-5 py-3 text-left">Old Cur Right</th>

                <th className="px-5 py-3 text-left">Rep Left</th>
                <th className="px-5 py-3 text-left">Rep Right</th>
                <th className="px-5 py-3 text-left">Rep Self</th>

                <th className="px-5 py-3 text-left">Pair</th>

                <th className="px-5 py-3 text-left">Amount</th>
                <th className="px-5 py-3 text-left">TDS</th>
                <th className="px-5 py-3 text-left">Admin Charge</th>

                <th className="px-5 py-3 text-left">Voucher</th>
                <th className="px-5 py-3 text-left">Payable</th>

                <th className="px-5 py-3 text-left">Bonus</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={18}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={18}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((item, i) => (
                  <tr key={i} className="border-t hover:bg-accent/30">
                    <td className="px-5 py-3">
                      {(page - 1) * pageSize + i + 1}
                    </td>

                    <td className="px-5 py-3 text-nowrap">
                      {item.PayoutDate?.split("T")[0]?.split("-").reverse().join("/")}
                    </td>

                    <td className="px-5 py-3">{item.CurrentLeft}</td>
                    <td className="px-5 py-3">{item.CurrentRight}</td>

                    <td className="px-5 py-3">{item.OldLeftCarry}</td>
                    <td className="px-5 py-3">{item.OldRightCarry}</td>

                    <td className="px-5 py-3">{item.PurCurrentLeft}</td>
                    <td className="px-5 py-3">{item.PurCurrentRight}</td>

                    <td className="px-5 py-3">{item.Flag}</td>

                    <td className="px-5 py-3">{item.Pair}</td>

                    <td className="px-5 py-3">{item.Amount}</td>
                    <td className="px-5 py-3">{item.TDS}</td>
                    <td className="px-5 py-3">{item.AdminCharge}</td>

                    <td className="px-5 py-3">{item.Vouchur}</td>

                    <td className="px-5 py-3 font-semibold">{item.Payable}</td>

                    <td className="px-5 py-3 text-emerald-500 font-medium">
                      {item.Bonus}
                    </td>

                    <td className="px-5 py-3">{item.Status}</td>

                    <td className="px-5 py-3">
                      <a
                        href={`/statement/${item.BinaryPayoutID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Statement
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page <b>{page}</b> of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="h-9 w-9 rounded-lg border flex items-center justify-center disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="px-3 text-sm">{page}</div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-9 w-9 rounded-lg border flex items-center justify-center disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
