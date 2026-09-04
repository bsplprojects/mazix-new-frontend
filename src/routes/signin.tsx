import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/services/authApi";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";

type User = {
  MID: string | null;
  MemberID: string | null;
  role: "admin" | "member" | "franchise";
};

type Data = {
  token: string;
  user: User;
};

export default function SignIn() {
  const navigate = useNavigate();
  const { mId, memberId, login, role } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    MemberID: "",
    Password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await loginUser(form.MemberID, form.Password);
      return res;
    },
    onSuccess: (data: Data) => {
      if (data.user.MID === null || data.user.MemberID === null) {
        toast.error("User not found");
        return;
      }
      login(data.user.MID, data.user.MemberID, data.user.role as User["role"]);
      if (data.user.role === "member" || data.user.role === "franchise") {
        navigate("/dashboard");
      } else if (data.user.role === "admin") {
        sessionStorage.setItem("adminToken", data.token);
        navigate("/admin");
      }
    },
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else if (error.statusCode === 401) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.MemberID || !form.Password) {
      toast.error("Please enter Member ID and Password");
      return;
    }

    loginMutation.mutate();
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your wallet, binary tree and rewards."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Member ID */}
        <div className="space-y-2">
          <Label>Member ID</Label>
          <Input
            value={form.MemberID}
            onChange={(e) => setForm({ ...form, MemberID: e.target.value })}
            className="h-11 bg-input border-border"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label>Password</Label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={form.Password}
              onChange={(e) => setForm({ ...form, Password: e.target.value })}
              className="h-11 bg-input border-border pr-20"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-primary"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-11 bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90"
        >
          {loginMutation.isPending ? "Signing in…" : "Sign In to Dashboard"}
        </Button>
      </form>
    </AuthShell>
  );
}
