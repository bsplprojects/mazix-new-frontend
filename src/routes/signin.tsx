import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginMember } from "@/services/authApi";
import { toast } from "sonner";

export default function SignIn() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    MemberID: "",
    Password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.MemberID || !form.Password) {
      toast.error("Please enter MemberID and Password");
      return;
    }

    setLoading(true);

    try {
      const data = await loginMember(form.MemberID, form.Password);
      if (!data.success) {
        toast.error(data.message || "Login failed");
        return;
      }

      // localStorage.setItem("token", data.token);
      sessionStorage.setItem("MID", data?.user?.MID);
      sessionStorage.setItem("memberID", data?.user?.MemberID);
      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
          className="w-full h-11 bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90"
        >
          {loading ? "Signing in…" : "Sign In to Dashboard"}
        </Button>
      </form>
    </AuthShell>
  );
}
