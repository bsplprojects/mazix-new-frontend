import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Join — Mazix" },
      {
        name: "description",
        content: "Create your Mazix member account and start building your binary network.",
      },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell
      title="Join the network"
      subtitle="Create your member account and choose a placement leg."
      footer={
        <>
          Already a member?{" "}
          <Link to="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => navigate({ to: "/dashboard" }), 700);
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="fn">First Name</Label>
            <Input id="fn" placeholder="Aarav" className="h-11 bg-input border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ln">Last Name</Label>
            <Input id="ln" placeholder="Mehta" className="h-11 bg-input border-border" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="em">Email</Label>
          <Input
            id="em"
            type="email"
            placeholder="you@example.com"
            className="h-11 bg-input border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sp">Sponsor ID</Label>
          <Input id="sp" defaultValue="BIN-1209" className="h-11 bg-input border-border" />
        </div>
        <div className="space-y-2">
          <Label>Placement Leg</Label>
          <RadioGroup defaultValue="left" className="grid grid-cols-2 gap-3">
            <Label className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3 cursor-pointer hover:border-primary/50 transition-smooth has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="left" />
              <span>Left Leg</span>
            </Label>
            <Label className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3 cursor-pointer hover:border-primary/50 transition-smooth has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <RadioGroupItem value="right" />
              <span>Right Leg</span>
            </Label>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pw">Password</Label>
          <Input
            id="pw"
            type="password"
            placeholder="Min. 8 characters"
            className="h-11 bg-input border-border"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90 mt-2"
        >
          {loading ? "Creating account…" : "Create Member Account"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          By joining you agree to the Mazix compensation plan & terms.
        </p>
      </form>
    </AuthShell>
  );
}
