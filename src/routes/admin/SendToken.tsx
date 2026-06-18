import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/config/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

const SendToken = () => {
  const [data, setData] = useState({
    PackageID: "",
    PayMode: "Paid",
    ToMemberID: "",
    TokenNo: "",
    TokenTypeID: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/admin/send-token`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Token sent successfully");
      setData({
        PackageID: "",
        PayMode: "Paid",
        ToMemberID: "",
        TokenNo: "",
        TokenTypeID: "",
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleSubmit = () => {
    mutation.mutate();
  };

  return (
    <main>
      <h2 className="text-2xl font-bold tracking-tight text-white">
        Send Token
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-5 ">
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Member ID
          </Label>
          <Input placeholder="MAZ000091" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Package
          </Label>
          <Select
            value={data.PackageID}
            onValueChange={(e: string) => setData({ ...data, PackageID: e })}
          >
            <SelectTrigger className="w-full mt-1 ">
              <SelectValue placeholder="Select Package Type" />
            </SelectTrigger>
            <SelectContent>{/* <SelectItem></SelectItem> */}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Token Type
          </Label>
          <Select
            value={data.TokenTypeID}
            onValueChange={(e: string) => setData({ ...data, TokenTypeID: e })}
          >
            <SelectTrigger className="w-full mt-1 ">
              <SelectValue placeholder="Select Token Type" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="-">No Item</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Token No.
          </Label>
          <Input
            placeholder="3"
            className="mt-1"
            value={data.TokenNo}
            onChange={(e) => setData({ ...data, TokenNo: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Pay Type
          </Label>
          <Select
            value={data.PayMode}
            onValueChange={(e: string) => setData({ ...data, PayMode: e })}
          >
            <SelectTrigger className="w-full mt-1 ">
              <SelectValue placeholder="Select Pay Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="free">Free</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button
            onClick={handleSubmit}
            className="h-11 flex-1 rounded-2xl bg-linear-to-r from-yellow-400 to-yellow-600 font-semibold text-black w-full"
          >
            Send
          </Button>
        </div>
      </div>
    </main>
  );
};

export default SendToken;
