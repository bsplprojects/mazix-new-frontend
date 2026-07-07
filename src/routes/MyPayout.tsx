import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { PageHeader, StatCard } from "@/components/dashboard-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { Button } from "@/components/ui/button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function MyPayout() {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const memberId = sessionStorage.getItem("memberID");

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { isLoading } = useQuery({
    queryKey: ["payout", fromDate, toDate, page, pageSize],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/team/my-income/${memberId}?page=${page}&pageSize=${pageSize}&fromDate=${fromDate}&toDate=${toDate}`,
      );
      setData(res.data?.items || []);
      setTotalPages(res.data?.totalPages || 1);
      return res.data;
    },
  });

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

  const handleExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Binary Payout");

    worksheet.columns = [
      { header: "#", key: "index", width: 5 },
      { header: "Payout Date", key: "PayoutDate", width: 15 },

      { header: "Cur ORG 1", key: "CurrentLeft", width: 12 },
      { header: "Cur ORG 2", key: "CurrentRight", width: 12 },

      { header: "Old Cur ORG 1", key: "OldLeftCarry", width: 15 },
      { header: "Old Cur ORG 2", key: "OldRightCarry", width: 15 },

      { header: "Rep ORG 1", key: "PurCurrentLeft", width: 12 },
      { header: "Rep ORG 2", key: "PurCurrentRight", width: 12 },

      { header: "Rep Self", key: "Flag", width: 12 },
      { header: "Pair", key: "Pair", width: 10 },

      { header: "Amount", key: "Amount", width: 12 },
      { header: "TDS", key: "TDS", width: 10 },
      { header: "Processing Charge", key: "AdminCharge", width: 18 },

      { header: "Voucher", key: "Vouchur", width: 12 },
      { header: "Payable", key: "Payable", width: 12 },

      { header: "Bonus", key: "Bonus", width: 12 },
      { header: "Status", key: "Status", width: 12 },
    ];

    worksheet.getRow(1).font = { bold: true };

    data.forEach((item, i) => {
      worksheet.addRow({
        index: i + 1,

        PayoutDate: item.PayoutDate
          ? item.PayoutDate.split("T")[0].split("-").reverse().join("/")
          : "",

        CurrentLeft: item.CurrentLeft,
        CurrentRight: item.CurrentRight,

        OldLeftCarry: item.OldLeftCarry,
        OldRightCarry: item.OldRightCarry,

        PurCurrentLeft: item.PurCurrentLeft,
        PurCurrentRight: item.PurCurrentRight,

        Flag: item.Flag,
        Pair: item.Pair,

        Amount: item.Amount,
        TDS: item.TDS,
        AdminCharge: item.AdminCharge,

        Vouchur: item.Vouchur,
        Payable: item.Payable,

        Bonus: item.Bonus,
        Status: item.Status,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Binary_Payout.xlsx");
  };

  return (
    <div className="space-y-6 max-w-350 mx-auto">
      <PageHeader title="My Payout" subtitle="Payout history with summary" />

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
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          {/* From Date */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              From Date
            </label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
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
            />
          </div>

          {/* Page Size */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Rows per page
            </label>

            <Select
              value={String(pageSize)}
              onValueChange={(val) => setPageSize(Number(val))}
            >
              <SelectTrigger className="w-full rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="10 / page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => {
              setFromDate("");
              setToDate("");
              setPageSize(10);
            }}
          >
            Reset
          </Button>
          <Button onClick={handleExcel}>
            <Download className="h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            {/* HEADER */}
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground text-nowrap">
              <tr>
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Payout Date</th>

                <th className="px-5 py-3 text-left">Cur ORG 1</th>
                <th className="px-5 py-3 text-left">Cur ORG 2</th>

                <th className="px-5 py-3 text-left">Old Carry Fwd ORG 1</th>
                <th className="px-5 py-3 text-left">Old Carry Fwd ORG 2</th>

                <th className="px-5 py-3 text-left">Rep ORG 1</th>
                <th className="px-5 py-3 text-left">Rep ORG 2</th>
                <th className="px-5 py-3 text-left">Rep Self</th>

                <th className="px-5 py-3 text-left">Matching</th>

                <th className="px-5 py-3 text-left">Amount</th>
                <th className="px-5 py-3 text-left">TDS</th>
                <th className="px-5 py-3 text-left">Processing Charge</th>

                <th className="px-5 py-3 text-left">Voucher</th>
                <th className="px-5 py-3 text-left">Payable</th>

                <th className="px-5 py-3 text-left">Bonus</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {isLoading ? (
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
                      {item.PayoutDate?.split("T")[0]
                        ?.split("-")
                        .reverse()
                        .join("/")}
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
                        href={`/dashboard/statement/${item.BinaryPayoutID}`}
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
