import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  CreditCard,
  Wallet,
  Smartphone,
  Building2,
  Banknote,
  ShoppingCart,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  cartStore,
  useCart,
  cartTotals,
  type Address,
  type PaymentMethod,
  type OrderType,
} from "@/lib/cart-store";
import { member } from "@/lib/mock-data";

const searchSchema = z.object({
  kind: z.enum(["purchase", "repurchase", "joining"]).catch("purchase"),
});

export const Route = createFileRoute("/dashboard/checkout")({
  validateSearch: searchSchema,
  component: Checkout,
});

const STEPS = ["Cart", "Address", "Payment", "Review"] as const;
type Step = (typeof STEPS)[number];

function Checkout() {
  const { kind } = Route.useSearch();
  const state = useCart();
  const channel = state[kind];
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("Cart");
  const [addr, setAddr] = useState<Address>(channel.address);
  const [payment, setPayment] = useState<PaymentMethod>(channel.payment);
  const [placing, setPlacing] = useState(false);
  const totals = cartTotals(channel.cart);
  const otherKind: OrderType = kind === "purchase" ? "repurchase" : "purchase";
  const otherCount = state[otherKind].cart.reduce((s, i) => s + i.qty, 0);

  if (channel.cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="font-display text-2xl mb-2">Your {kind} cart is empty</h2>
        <p className="text-sm text-muted-foreground mb-6">Add a product to start a {kind}.</p>
        <div className="flex flex-col gap-2">
          <Button asChild className="bg-gradient-emerald text-primary-foreground shadow-glow">
            <Link to={kind === "purchase" ? "/dashboard/purchase" : "/dashboard/repurchase"}>
              Browse {kind === "purchase" ? "Purchase" : "Repurchase"} Products
            </Link>
          </Button>
          {otherCount > 0 && (
            <Button asChild variant="outline">
              <Link to="/dashboard/checkout" search={{ kind: otherKind }}>
                Switch to {otherKind} cart ({otherCount})
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  const stepIdx = STEPS.indexOf(step);
  const next = () => {
    if (step === "Address") {
      if (
        !addr.fullName ||
        !addr.phone ||
        !addr.line1 ||
        !addr.city ||
        !addr.state ||
        !addr.pincode
      ) {
        toast.error("Please fill all required address fields");
        return;
      }
      cartStore.setAddress(kind, addr);
    }
    if (step === "Payment") cartStore.setPayment(kind, payment);
    setStep(STEPS[stepIdx + 1]);
  };
  const back = () => stepIdx > 0 && setStep(STEPS[stepIdx - 1]);

  const place = async () => {
    if (payment === "wallet" && member.walletBalance < totals.total) {
      toast.error("Insufficient wallet balance");
      return;
    }
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 900));
    const order = cartStore.placeOrder(kind);
    setPlacing(false);
    toast.success("Order placed successfully");
    navigate({ to: "/dashboard/orders/$id", params: { id: order.id } });
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <PageHeader
      title={
          kind === "purchase"
            ? "Checkout · Purchase"
            : kind === "repurchase"
              ? "Checkout · Repurchase"
              : "Checkout · Joining"
        }
        subtitle="Complete your order in 4 quick steps"
        action={
          otherCount > 0 ? (
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard/checkout" search={{ kind: otherKind }}>
                {otherKind === "purchase" ? "Purchase" : "Repurchase"} cart ({otherCount})
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="rounded-2xl bg-gradient-card border border-border/60 p-5 shadow-card">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((s, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-smooth border",
                    done &&
                      "bg-gradient-emerald text-primary-foreground border-transparent shadow-glow",
                    active && "bg-brass/15 text-brass border-brass/40",
                    !done && !active && "bg-secondary/40 text-muted-foreground border-border",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <div className="hidden sm:block">
                  <div
                    className={cn(
                      "text-xs uppercase tracking-wider",
                      active ? "text-brass" : "text-muted-foreground",
                    )}
                  >
                    Step {i + 1}
                  </div>
                  <div className={cn("text-sm font-medium", active && "text-foreground")}>{s}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("h-px flex-1", done ? "bg-primary/50" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card">
          {step === "Cart" && <StepCart kind={kind} />}
          {step === "Address" && <StepAddress addr={addr} setAddr={setAddr} />}
          {step === "Payment" && (
            <StepPayment payment={payment} setPayment={setPayment} total={totals.total} />
          )}
          {step === "Review" && <StepReview kind={kind} addr={addr} payment={payment} />}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={back} disabled={stepIdx === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {step !== "Review" ? (
              <Button
                onClick={next}
                className="bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={place}
                disabled={placing}
                className="bg-gradient-brass text-brass-foreground shadow-brass hover:opacity-90"
              >
                {placing ? (
                  "Placing order…"
                ) : (
                  <>Place Order · ₹{totals.total.toLocaleString("en-IN")}</>
                )}
              </Button>
            )}
          </div>
        </div>

        <OrderSummary kind={kind} />
      </div>
    </div>
  );
}

function StepCart({ kind }: { kind: OrderType }) {
  const state = useCart();
  const totals = cartTotals(state[kind].cart);
  return (
    <div>
      <h2 className="font-display text-2xl mb-1">Review your cart</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Adjust quantities or remove items before continuing.
      </p>
      <div className="space-y-3">
        {totals.items.map((i) => (
          <div
            key={i.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/40"
          >
            <div className="text-3xl">{i.image}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{i.name}</div>
              <div className="text-xs text-muted-foreground font-mono">
                {i.id} · {i.bv} BV each
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border p-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => cartStore.setQty(kind, i.id, i.qty - 1)}
              >
                −
              </Button>
              <span className="w-6 text-center text-sm font-mono">{i.qty}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => cartStore.setQty(kind, i.id, i.qty + 1)}
              >
                +
              </Button>
            </div>
            <div className="text-right min-w-[80px]">
              <div className="font-mono text-sm">₹{i.lineTotal.toLocaleString("en-IN")}</div>
              <div className="font-mono text-xs text-primary">{i.lineBV} BV</div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => cartStore.remove(kind, i.id)}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {totals.items.length === 0 && (
          <div className="text-center py-10 text-sm text-muted-foreground border border-dashed border-border rounded-xl">
            Your cart is empty.
          </div>
        )}
      </div>
    </div>
  );
}

function StepAddress({ addr, setAddr }: { addr: Address; setAddr: (a: Address) => void }) {
  const f = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddr({ ...addr, [k]: e.target.value });
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl">Shipping address</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Where should we ship your order?</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name *">
          <Input value={addr.fullName} onChange={f("fullName")} />
        </Field>
        <Field label="Phone *">
          <Input value={addr.phone} onChange={f("phone")} />
        </Field>
        <Field label="Address line 1 *" full>
          <Input value={addr.line1} onChange={f("line1")} />
        </Field>
        <Field label="Address line 2" full>
          <Input value={addr.line2 || ""} onChange={f("line2")} />
        </Field>
        <Field label="City *">
          <Input value={addr.city} onChange={f("city")} />
        </Field>
        <Field label="State *">
          <Input value={addr.state} onChange={f("state")} />
        </Field>
        <Field label="Pincode *">
          <Input value={addr.pincode} onChange={f("pincode")} />
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={cn("space-y-1.5", full && "sm:col-span-2")}>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function StepPayment({
  payment,
  setPayment,
  total,
}: {
  payment: PaymentMethod;
  setPayment: (p: PaymentMethod) => void;
  total: number;
}) {
  const opts: { id: PaymentMethod; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: "wallet",
      label: "E-Wallet",
      desc: `Balance ₹${member.walletBalance.toLocaleString("en-IN")}`,
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      id: "upi",
      label: "UPI",
      desc: "Pay via GPay, PhonePe, Paytm",
      icon: <Smartphone className="h-5 w-5" />,
    },
    {
      id: "card",
      label: "Credit / Debit Card",
      desc: "Visa, Mastercard, RuPay",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "netbanking",
      label: "Net Banking",
      desc: "All major Indian banks",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      desc: "Pay when you receive",
      icon: <Banknote className="h-5 w-5" />,
    },
  ];
  const lowBal = payment === "wallet" && member.walletBalance < total;
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <CreditCard className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl">Payment method</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Choose how you'd like to pay.</p>
      <div className="space-y-2">
        {opts.map((o) => (
          <button
            key={o.id}
            onClick={() => setPayment(o.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-smooth",
              payment === o.id
                ? "border-primary/60 bg-primary/5 shadow-glow"
                : "border-border bg-secondary/20 hover:border-border/80",
            )}
          >
            <div
              className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center",
                payment === o.id
                  ? "bg-gradient-emerald text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground",
              )}
            >
              {o.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium">{o.label}</div>
              <div className="text-xs text-muted-foreground">{o.desc}</div>
            </div>
            <div
              className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                payment === o.id ? "border-primary bg-primary" : "border-border",
              )}
            >
              {payment === o.id && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>
          </button>
        ))}
      </div>
      {lowBal && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
          Insufficient wallet balance for this order. Pick another payment method.
        </div>
      )}
    </div>
  );
}

function StepReview({
  kind,
  addr,
  payment,
}: {
  kind: OrderType;
  addr: Address;
  payment: PaymentMethod;
}) {
  const state = useCart();
  const totals = cartTotals(state[kind].cart);
  const payLabel: Record<PaymentMethod, string> = {
    wallet: "E-Wallet",
    upi: "UPI",
    card: "Card",
    netbanking: "Net Banking",
    cod: "Cash on Delivery",
  };
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl">Review & confirm</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">A final look before placing your order.</p>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-border p-4 bg-secondary/20">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Ship to</div>
          <div className="text-sm font-medium">{addr.fullName}</div>
          <div className="text-sm text-muted-foreground">
            {addr.line1}
            {addr.line2 && `, ${addr.line2}`}
          </div>
          <div className="text-sm text-muted-foreground">
            {addr.city}, {addr.state} {addr.pincode}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{addr.phone}</div>
        </div>
        <div className="rounded-xl border border-border p-4 bg-secondary/20">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Payment</div>
          <div className="text-sm font-medium">{payLabel[payment]}</div>
          <Badge
            variant="outline"
            className="mt-2 border-primary/40 text-primary bg-primary/5 capitalize"
          >
            {kind}
          </Badge>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-secondary/20 divide-y divide-border">
        {totals.items.map((i) => (
          <div key={i.id} className="flex items-center gap-3 p-3">
            <div className="text-2xl">{i.image}</div>
            <div className="flex-1">
              <div className="text-sm font-medium">{i.name}</div>
              <div className="text-xs text-muted-foreground font-mono">
                Qty {i.qty} · {i.lineBV} BV
              </div>
            </div>
            <div className="font-mono text-sm">₹{i.lineTotal.toLocaleString("en-IN")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderSummary({ kind }: { kind: OrderType }) {
  const state = useCart();
  const totals = cartTotals(state[kind].cart);
  return (
    <div className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card h-fit lg:sticky lg:top-20">
      <h3 className="font-display text-lg mb-4">Order Summary</h3>
      <div className="space-y-2 text-sm">
        <Row label="Items" value={`${totals.items.reduce((s, i) => s + i.qty, 0)}`} />
        <Row label="Subtotal" value={`₹${totals.subtotal.toLocaleString("en-IN")}`} />
        <Row label="GST (18%)" value={`₹${totals.gst.toLocaleString("en-IN")}`} />
        <Row label="Shipping" value={totals.shipping === 0 ? "Free" : `₹${totals.shipping}`} />
      </div>
      <div className="border-t border-border mt-4 pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">BV Credit</span>
          <span className="font-mono text-primary">{totals.bvTotal} BV</span>
        </div>
        <div className="flex justify-between text-base">
          <span className="font-medium">Total</span>
          <span className="font-mono font-semibold text-brass">
            ₹{totals.total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
      <div className="mt-5 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground flex gap-2">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <span>Secured by Mazix Commerce. Earnings credited within 24 hours of confirmation.</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
