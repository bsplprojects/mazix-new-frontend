import { useState } from "react";
import { usersApi } from "@/services/users.Api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ResetPasswordModal({ user, onClose }: any) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    try {
      setLoading(true);

      await usersApi.post("/reset-password", {
        MemberID: user.MemberID,
        Password: password,
      });

      toast.success("Password Updated");
      onClose();
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0b0f19] p-6 rounded-2xl w-[400px] space-y-4 border border-white/10">
        <h2 className="text-xl font-bold text-white">Reset Password</h2>

        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex gap-2">
          <Button className="flex-1" onClick={resetPassword} disabled={loading}>
            Update
          </Button>

          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
