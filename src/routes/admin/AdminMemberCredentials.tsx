import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff, KeyRound, Loader2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AdminMemberPassword = () => {
  const [memberId, setMemberId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Member Credentials
      </h2>
      <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
        {/* SEARCH SECTION */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          {/* MEMBER ID INPUT */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Member ID
            </label>

            <div className="relative">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />

              <Input
                placeholder="Enter Member ID"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="h-11 rounded-xl border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={mutation.isPending || !memberId}
              className="h-11 min-w-[110px] rounded-xl"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* RESULT SECTION */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* MEMBER ID */}
        <div className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Member ID
              </p>

              <p className="mt-1 truncate text-base font-semibold text-foreground">
                {mutation.data?.[0] ?? "-"}
              </p>
            </div>
          </div>
        </div>

        {/* PASSWORD */}
        {/* PASSWORD */}
        <div className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </p>

              <div className="mt-1 flex items-center gap-2">
                <p className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">
                  {showPassword ? (mutation.data?.[1] ?? "-") : "••••••••"}
                </p>

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMemberPassword;
