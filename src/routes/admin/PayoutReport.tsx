import StatusModal from "@/components/StatusModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const PayoutReport = () => {
  const [memberId, setMemberId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [singleMember, setSingleMember] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modal, setModal] = useState({
    type: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/reports/payout`, {
        FromDate: fromDate,
        MemberId: memberId,
        Todate: toDate,
      });
      return res.data;
    },
    onMutate: () => {
      setProgress(0);

      let current = 0;

      const interval = setInterval(() => {
        current += Math.random() * 8;

        if (current >= 95) {
          current = 95;
        }

        setProgress(Math.floor(current));
      }, 200);

      window.progressInterval = interval;
    },

    onSuccess: () => {
      setModal({
        type: "success",
        message: "Report generated successfully",
      });
      setFromDate("");
      setToDate("");
      setMemberId("");
      clearInterval(window.progressInterval);

      setProgress(100);

      setTimeout(() => setProgress(0), 500);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        setModal({
          type: "error",
          message:
            err.response?.data?.message ||
            "Failed to generate report. Please try again later.",
        });
      } else {
        setModal({
          type: "error",
          message: "Something went wrong",
        });
      }
      clearInterval(window.progressInterval);
      setProgress(0);
      setFromDate("");
      setToDate("");
      setMemberId("");
    },
  });

  const handleGenerate = () => {
    const now = new Date();

    const currentHour = now.getHours();

    // Only allowed from 10:00 PM  to 11:59 PM
    const isAllowedTime = currentHour >= 22 && currentHour < 24;

    // if (!isAllowedTime) {
    //   setModal({
    //     type: "info",
    //     message:
    //       "Payment report can be generated only between 10:00 PM to 12:00 AM",
    //   });
    //   return;
    // }

    if (singleMember && !memberId) {
      return toast.error("Please enter the Member ID");
    }

    mutation.mutate();
  };

  return (
    <main>
      <div className="space-y-8">
        <div className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500">
          ⚠ This report is still under development. Please do not use it.
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            MLM OPS • PAYOUT REPORT
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Payout Report Console
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              Generate payout reports for a selected date range. Reports are
              prepared securely and processed server-side.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border bg-card p-8 shadow-sm">
          <div className="grid gap-6">
            {/* Single Member Toggle */}
            <div className="rounded-2xl border bg-background/50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Label
                    htmlFor="single-member"
                    className="text-sm font-semibold cursor-pointer"
                  >
                    Generate Single Member Payout
                  </Label>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Enable this option if you want to generate payout for only
                    one member.
                  </p>
                </div>

                <Switch
                  id="single-member"
                  checked={singleMember}
                  onCheckedChange={setSingleMember}
                />
              </div>
            </div>

            {singleMember && (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Member ID
                </label>

                <Input
                  placeholder="Enter Member ID"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="h-12 rounded-xl bg-background"
                />
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  From Date
                </label>

                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-12 rounded-xl bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  To Date
                </label>

                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-12 rounded-xl bg-background"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={mutation.isPending}
              size="lg"
              className="mt-2 h-12 rounded-xl text-base font-semibold"
            >
              {mutation.isPending
                ? `Generating ${progress}%`
                : "Generate Report"}
            </Button>

            <div className="border-t pt-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full border p-1">🔒</div>

                <p className="text-sm text-muted-foreground">
                  Reports are generated securely on the server. Data will only
                  be available after the report has been completely prepared.
                </p>
              </div>
            </div>
          </div>

          {mutation.isPending && (
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Preparing report...
                </span>

                <span className="font-semibold">{progress}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <StatusModal modal={modal} setModal={setModal} />
        </div>
      </div>
    </main>
  );
};

export default PayoutReport;
