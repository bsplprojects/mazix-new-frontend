import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard-ui";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRepurchase } from "@/hooks/useRepurchase";
import Loader from "@/components/Loader";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";

// fDate and tDate be 1 month
const fDate = new Date("2020-01-01");
const tDate = new Date();

export default function RepHistory() {
  const [q, setQ] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: fDate,
    to: tDate,
  });

  const { repurchaseHistory, isLoading } = useRepurchase({
    fDate: date && date.from,
    tDate: date && date.to,
    limit: 1000,
  });

  const filtered = useMemo(() => {
    if (!q || q.length <= 0) return repurchaseHistory;

    const filteredHistory = repurchaseHistory.filter((order) => {
      return order?.OrderNo.toLowerCase().includes(q.toLowerCase());
    });

    return filteredHistory;
  }, [q, repurchaseHistory]);

  return (
    <div className="max-w-350 mx-auto space-y-6">
      <PageHeader
        title="History"
        subtitle="All your purchase and repurchase orders"
      />

      <div className="grid grid-cols-3 gap-3">
        <Field className="mx-auto ">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker-range"
                className="justify-start px-2.5 font-normal"
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </Field>

        <div className="relative flex-1 min-w-50 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by order number"
            className="pl-9 bg-input/50"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-card border border-border/60 shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
            <tr>
              <th className="text-left px-6 py-3">Order No.</th>
              <th className="text-left px-6 py-3">Order Date</th>
              <th className="text-left px-6 py-3">Total Amount</th>
              <th className="text-left px-6 py-3">Total BV</th>
              <th className="text-left px-6 py-3">Current Wallet</th>
              <th className="text-left px-6 py-3">Previous Wallet</th>
              <th className="text-right px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <Loader />
            ) : filtered.length > 0 ? (
              filtered.map((o) => (
                <tr
                  key={o?.RepOrderID}
                  className="hover:bg-accent/30 transition-smooth cursor-pointer"
                >
                  <td className="px-6 py-4 font-mono text-xs">
                    <Link
                      to={`/dashboard/orders/${o?.RepOrderID}`}
                      className="text-primary hover:underline"
                    >
                      {o?.OrderNo}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {o?.OrderDate?.split("T")[0]}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    ₹{o?.TotalAmount?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    ₹{o?.TotalBV?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    ₹{o?.RepCurrentWallet?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    ₹{o?.RepPrevWallet?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <Badge variant="outline">{o?.OrderStatus}</Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
