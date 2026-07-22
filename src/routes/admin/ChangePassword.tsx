import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ChangePassword = () => {
  const [memberId, setMemberId] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");

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
    onSuccess: (data) => {
      setOldPassword(data?.[1]);
    },
  });

  const handleSearch = () => {
    if (!memberId) return;
    mutation.mutate();
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        `/admin/new-password?id=${memberId}`,
        {
          oldPassword,
          password,
        },
      );
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
      setPassword("");
      setOldPassword("");
      toast.success("Password updated successfully");
    },
  });

  const handlePasswordUpdate = () => {
    if (!password) {
      toast.error("Please enter password");
      return;
    }
    updateMutation.mutate();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Change Password
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5 mt-5">
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
              className=" rounded-2xl border border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-primary"
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
      {mutation.data && (
        <>
          <div className="my-5">
            <h1 className="font-semibold text-primary">Member ID</h1>
            <span>{mutation.data?.[0]}</span>
          </div>
          <div className="my-5">
            <h1 className="font-semibold text-primary">Old Password</h1>
            <Input value={oldPassword} className="w-fit" disabled />
          </div>
          <div className="my-5">
            <h1 className="font-semibold text-primary">New Password</h1>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-fit"
            />
          </div>
          <Button onClick={handlePasswordUpdate}>Update</Button>
        </>
      )}
    </div>
  );
};

export default ChangePassword;
