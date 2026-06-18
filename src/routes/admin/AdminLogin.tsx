import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { loginAdmin } from "@/services/authApi";
import { ShieldCheck, Eye, EyeOff, LockKeyhole, UserCog } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const adminToken = sessionStorage.getItem("adminToken");

  const [form, setForm] = useState({
    Username: "",
    Password: "",
  });

  useEffect(() => {
    if (adminToken) {
      navigate("/admin");
    }
  }, [adminToken]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.Username || !form.Password) {
      toast.error("Enter Username & Password");
      return;
    }

    setLoading(true);

    try {
      const data = await loginAdmin(form.Username, form.Password);

      if (!data.success) {
        toast.error(data.message || "Admin login failed");
        return;
      }

      sessionStorage.setItem("adminToken", data.token);
      sessionStorage.setItem("role", "admin");

      toast.success("Welcome Admin");

      navigate("/admin");
    } catch (err) {
      console.log(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Top Logo / Heading */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/20">
            <ShieldCheck className="w-10 h-10 text-black" />
          </div>

          <h1 className="text-3xl font-bold text-white mt-5">Admin Panel</h1>

          <p className="text-zinc-400 mt-2 text-sm">Authorized access only</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Admin Username</Label>

              <div className="relative">
                <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />

                <Input
                  placeholder="Enter admin username"
                  value={form.Username}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      Username: e.target.value,
                    })
                  }
                  className="h-12 pl-11 bg-zinc-900/70 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Password</Label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={form.Password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      Password: e.target.value,
                    })
                  }
                  className="h-12 pl-11 pr-12 bg-zinc-900/70 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-yellow-500 focus:ring-yellow-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:opacity-90 transition-all duration-300 shadow-lg shadow-yellow-500/20"
            >
              {loading ? "Signing in..." : "Admin Login"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-500">
              Secure Admin Authentication System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
