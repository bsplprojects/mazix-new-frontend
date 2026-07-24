import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Download, Loader2, Users } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { AxiosError } from "axios";
import { toast } from "sonner";

const PurchaseReport = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const [delivery, setDelivery] = useState({
    deliveryPartner: "",
    trackerId: "",
  });

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["purchase-reports"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reports/purchase", {
        params: {
          FromDate: fromDate,
          MemberId: memberId,
          Todate: toDate,
          OrderNo: "",
          PayMode: "",
          DeliveryStatus: "",
        },
      });
      return data;
    },
    enabled: false,
  });

  const reports = data?.data || [];

  const mutation = useMutation({
    mutationFn: async (orderNo: string) => {
      const res = await axiosInstance.post(
        `/admin/order/delivery/${orderNo}`,
        delivery,
      );
      return res.data;
    },
    onSuccess: () => {
      setOpen(false);
      setDelivery({
        deliveryPartner: "",
        trackerId: "",
      });
      refetch();
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  console.log(reports);

  const handleSubmit = (orderNo: string) => {
    if (!delivery.deliveryPartner || !delivery.trackerId) {
      alert("Please fill all the fields");
      return;
    }
    mutation.mutate(orderNo);
  };

  const handleExcel = () => {
    if (!reports || reports.length === 0) {
      alert("No data found");
      return;
    }
    const excelData = reports.map((user: any, index: number) => ({
      "Sr.": index + 1,
      "Order No": user?.OrderNo ?? "-",
      "Order Date": user?.OrderDate
        ? new Date(user.OrderDate).toLocaleDateString()
        : "-",
      "Customer Name": user?.CustomerName ?? "-",
      Phone: user?.Phone ?? "-",
      City: user?.City ?? "-",
      "Total Amount": user?.TotalAmount ?? "-",
      "Pay Mode": user?.PayMode ?? "-",
      "Delivery Status": user?.DeliveryStatus ?? "-",
      "Delivery Partner": user?.DeliveryPartner ?? "-",
      "Tracker ID": user?.TrackingID ?? "-",
      "Products (QTY)": user?.ItemCount ?? "-",
      "Total CGST": user?.TotalCGST ?? "-",
      "Total SGST": user?.TotalSGST ?? "-",
      "Total IGST": user?.TotalIGST ?? "-",
      "Total GST": user?.TotalGST ?? "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet["!cols"] = [
      { wch: 6 }, // Sr.
      { wch: 18 }, // Order No
      { wch: 15 }, // Order Date
      { wch: 30 }, // Customer Name
      { wch: 18 }, // Phone
      { wch: 20 }, // City
      { wch: 15 }, // Total Amount
      { wch: 15 }, // Pay Mode
      { wch: 20 }, // Delivery Status
      { wch: 22 }, // Delivery Partner
      { wch: 25 }, // Tracker ID
      { wch: 18 }, // Products (QTY)
      { wch: 15 }, // Total CGST
      { wch: 15 }, // Total SGST
      { wch: 15 }, // Total IGST
      { wch: 15 }, // Total GST
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      blob,
      `Purchase_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  return (
    <main>
      <div className="flex flex-col gap-4 border-b border-white/10  lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Purchase List
              </h2>

              <p className="mt-1 text-sm text-accent-foreground">
                Showing{" "}
                <span className="font-semibold text-primary">
                  {reports.length}
                </span>{" "}
                results
              </p>
            </div>
          </div>
        </div>

        <div className="  bg-white/2 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {/* MEMBER ID */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                Member ID
              </label>

              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />

                <Input
                  placeholder="RMG1001"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="rounded-2xl border border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* FROM DATE */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                From Date
              </label>

              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-2xl border border-border bg-card text-foreground focus:border-primary focus-visible:ring-primary"
              />
            </div>

            {/* TO DATE */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                To Date
              </label>

              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-2xl border border-border bg-card text-foreground focus:border-primary focus-visible:ring-primary"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex items-end gap-2">
              <Button
                onClick={() => {
                  setPage(1);
                  refetch();
                }}
                disabled={isFetching}
              >
                {isFetching ? "Loading..." : "Search"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setMemberId("");
                  setFromDate("");
                  setToDate("");
                }}
              >
                Reset
              </Button>

              <Button variant={"default"} onClick={handleExcel}>
                <Download /> Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SALES LIST */}
      <div className="overflow-x-auto">
        {isFetching ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full min-w-250">
            <thead className="border-b border-border bg-muted/40 text-nowrap">
              <tr className="text-left">
                {/* TABLE HEADER */}
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Sr.
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Order No
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Order Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Customer Name
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Phone
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  City
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Total Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Pay Mode
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Delivery Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Delivery Partner
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Tracker ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Products (QTY)
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Total CGST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Total SGST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Total IGST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Total GST
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {reports?.map((user: any, index: number) => (
                <tr
                  key={index}
                  className="transition hover:bg-white/3 text-nowrap text-xs"
                >
                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-accent-foreground">
                    {index + 1}
                  </td>

                  <td className="px-6 py-5 text-sm font-semibold text-accent-foreground">
                    {user?.OrderNo}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {new Date(user.OrderDate).toLocaleDateString()}
                  </td>

                  {/* MEMBER */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="text-white font-medium">
                        {user.CustomerName || "-"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Phone || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.City || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.TotalAmount || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                    {user.PayMode || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.DeliveryStatus || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.DeliveryPartner || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.TrackingID || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.ItemCount || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.TotalCGST || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.TotalSGST || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.TotalIGST || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.TotalGST || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground space-y-1">
                    <Button
                      onClick={() =>
                        navigate(
                          `/admin/purchase-report/invoice/${user?.OrderNo}`,
                        )
                      }
                      size={"sm"}
                      variant={"outline"}
                    >
                      Invoice
                    </Button>

                    <Dialog open={open} onOpenChange={setOpen}>
                      <Button onClick={() => setOpen(true)} size={"sm"}>
                        Assign Delivery
                      </Button>

                      <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Assign Delivery</DialogTitle>
                          <DialogDescription>
                            Assign a delivery partner to this order.
                          </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                          <Field>
                            <Label htmlFor="deliveryPartner">
                              Delivery Partner
                            </Label>
                            <Input
                              id="deliveryPartner"
                              name="deliveryPartner"
                              value={delivery.deliveryPartner}
                              onChange={(e) =>
                                setDelivery((prev) => ({
                                  ...prev,
                                  deliveryPartner: e.target.value,
                                }))
                              }
                            />
                          </Field>
                          <Field>
                            <Label htmlFor="trackerId">Tracker ID</Label>
                            <Input
                              id="trackerId"
                              name="trackerId"
                              value={delivery.trackerId}
                              onChange={(e) =>
                                setDelivery((prev) => ({
                                  ...prev,
                                  trackerId: e.target.value,
                                }))
                              }
                            />
                          </Field>
                        </FieldGroup>
                        <DialogFooter>
                          <Button
                            onClick={() => handleSubmit(user.OrderNo)}
                            type="submit"
                            disabled={mutation.isPending}
                          >
                            {mutation.isPending ? "Saving..." : "Save changes"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isFetching && reports?.length === 0 && (
          <div className="py-20 text-center">
            <Users className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

            <h3 className="text-xl font-semibold text-accent-foreground">
              No Purchase Record Found
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Try searching with another keyword or dates.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default PurchaseReport;
