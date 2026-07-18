import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AdminMemberPassword = () => {
  const [memberId, setMemberId] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/admin/password?id=${memberId}`);
      return res.data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.message);
      } else {
        toast.error(err.message);
      }
    },
    onSuccess: () => {
      setMemberId("");
    },
  });

  const handleSearch = () => {
    if (!memberId) return;
    mutation.mutate();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-white">
        Member Credentials
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5 mt-5">
        {/* MEMBER ID */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Member ID
          </label>

          <div className="relative">
            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />

            <Input
              placeholder="RMG1001"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className=" rounded-2xl border border-white/10 bg-zinc-900/80 pl-10 text-white placeholder:text-zinc-500 focus:border-yellow-500"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex items-end gap-2">
          <Button
            onClick={handleSearch}
            disabled={mutation.isPending || !memberId}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>

      <div className="my-5">
        <h1 className="font-semibold text-primary">Member ID</h1>
        <span>{mutation.data?.[0] ?? "-"}</span>
      </div>
      <div>
        <h1 className="font-semibold text-primary">Password</h1>
        <span>{mutation.data?.[1] ?? "-"}</span>
      </div>
    </div>
  );
};

export default AdminMemberPassword;
