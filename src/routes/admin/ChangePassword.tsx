import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LockKeyhole,
  Save,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ChangePassword = () => {
  const [memberId, setMemberId] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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

      <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
        {/* SEARCH */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="w-full max-w-md space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Member ID
            </label>

            <div className="relative">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />

              <Input
                placeholder="Enter Member ID"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className=" rounded-xl border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-primary"
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={mutation.isPending || !memberId}
            className=" rounded-xl "
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className=" h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </div>
      </div>

      {/* PASSWORD UPDATE */}
      {mutation.data && (
        <div className="mt-5 rounded-2xl border border-border bg-card shadow-sm">
          {/* HEADER */}
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <LockKeyhole className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">
                  Password Management
                </h2>
                <p className="text-xs text-muted-foreground">
                  Update the member's login password
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">
            {/* MEMBER ID */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Member ID
              </label>

              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />

                <Input
                  value={mutation.data?.[0] ?? ""}
                  disabled
                  className="h-11 rounded-xl border-border bg-muted/40 pl-10 font-medium text-foreground"
                />
              </div>
            </div>

            {/* OLD PASSWORD */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Old Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={oldPassword}
                  disabled
                  type={showOldPassword ? "text" : "password"}
                  className="h-11 rounded-xl border-border bg-muted/40 pl-10 pr-10 text-foreground"
                />

                <button
                  type="button"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
                >
                  {showOldPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                New Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />

                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="h-11 rounded-xl border-border bg-background pl-10 pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-primary"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ACTION */}
          <div className="flex justify-end border-t border-border px-5 py-4">
            <Button
              onClick={handlePasswordUpdate}
              disabled={!password}
              className="rounded-xl px-6 h-11"
            >
              <Save className="mr-2 h-4 w-4" />
              Update Password
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
