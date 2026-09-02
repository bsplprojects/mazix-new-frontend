import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/config/axios";
import { CalendarDays, Expand } from "lucide-react";

const OfferPopup = () => {
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["active-offer"],
    queryFn: async () => {
      const res = await axiosInstance.get("/member/offer");
      return res.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setOpen(true);
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl overflow-hidden p-0 rounded-2xl">
        <DialogTitle className="sr-only">Current Offer</DialogTitle>

        <div className="relative">
          <img
            src={`https://app.mymazix.com/${data.Image.replace("../../", "")}`}
            alt={data.Title}
            className="w-full h-80 object-contain"
          />

          {/* Offer Badge */}
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-red-600/60 text-white px-4 py-1 text-sm font-semibold shadow-lg">
              🎁 Limited Time Offer
            </span>
          </div>

          {/* View Full Image */}
          <a
            href={`https://app.mymazix.com/${data.Image.replace("../../", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg dark:bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 text-xs font-medium dark:text-white shadow-lg transition-all dark:hover:bg-white/20"
          >
            <Expand size={14} />
          </a>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{data.Title}</h2>

            {data.Description && (
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {data.Description}
              </p>
            )}
          </div>

          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-sm font-medium flex items-center gap-2">
              <CalendarDays size={14} /> Offer Validity
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              This offer is valid from{" "}
              <span className="font-semibold text-foreground">
                {new Date(data.StartDate).toLocaleDateString("en-IN")}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-foreground">
                {new Date(data.EndDate).toLocaleDateString("en-IN")}
              </span>
              .
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Maybe Later
            </Button>

            {data.Link?.trim() && (
              <Button
                onClick={() => window.open(data.Link, "_blank")}
                className="min-w-40"
              >
                🎉 Claim Offer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferPopup;
