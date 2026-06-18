import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  CreditCard,
  Package,
  Download,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/orders/$id")({
  component: OrderDetail,
});

const payLabel: Record<string, string> = {
  wallet: "E-Wallet",
  upi: "UPI",
  card: "Card",
  netbanking: "Net Banking",
  cod: "Cash on Delivery",
};

function OrderDetail() {
  const { id } = useParams({ from: "/dashboard/orders/$id" });
  const state = useCart();
  const order = state.orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="font-display text-2xl mb-2">Order not found</h2>
        <Button asChild variant="outline">
          <Link to="/dashboard/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const timeline = ["Confirmed", "Shipped", "Delivered"];
  const currentIdx = timeline.indexOf(order.status === "Pending" ? "Confirmed" : order.status);
  const directBonus = Math.round(order.subtotal * 0.1);

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
        <Link to="/dashboard/orders">
          <ArrowLeft className="mr-2 h-4 w-4" /> All orders
        </Link>
      </Button>

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-hero border border-primary/30 p-8 shadow-elegant relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-emerald opacity-40" />
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <span className="text-xs uppercase tracking-wider text-primary">
                Order {order.status}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl mb-1">
              Thank you, your order is confirmed
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              {order.id} · placed {order.date}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Total paid</div>
            <div className="font-display text-3xl text-brass">
              ₹{order.total.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-primary mt-1">+{order.bvTotal} BV credited</div>
          </div>
        </div>
      </div>

      {/* Earnings flash */}
      <div className="rounded-2xl bg-gradient-card border border-brass/30 p-5 shadow-card flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-brass/10 text-brass flex items-center justify-center">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">
            BV will reflect on your weaker leg within 24 hours
          </div>
          <div className="text-xs text-muted-foreground">
            Sponsor earns ₹{directBonus.toLocaleString("en-IN")} direct bonus on this {order.type}.
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Invoice
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          {/* Tracking */}
          <div className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <h3 className="font-display text-lg mb-5">Tracking</h3>
            <div className="flex items-center justify-between gap-2">
              {timeline.map((t, i) => {
                const done = i <= currentIdx;
                return (
                  <div key={t} className="flex items-center gap-3 flex-1">
                    <div
                      className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center shrink-0 border transition-smooth",
                        done
                          ? "bg-gradient-emerald text-primary-foreground border-transparent shadow-glow"
                          : "bg-secondary/40 text-muted-foreground border-border",
                      )}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <div
                      className={cn(
                        "text-sm",
                        done ? "text-foreground font-medium" : "text-muted-foreground",
                      )}
                    >
                      {t}
                    </div>
                    {i < timeline.length - 1 && (
                      <div className={cn("h-px flex-1", done ? "bg-primary/50" : "bg-border")} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div className="rounded-2xl bg-gradient-card border border-border/60 shadow-card overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-lg">Items ({order.items.length})</h3>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  order.type === "purchase"
                    ? "border-primary/40 text-primary bg-primary/5"
                    : "border-brass/40 text-brass bg-brass/5",
                )}
              >
                {order.type}
              </Badge>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((i) => (
                <div key={i.productId} className="flex items-center gap-4 p-5">
                  <div className="h-14 w-14 rounded-lg bg-secondary/40 flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{i.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {i.productId} · Qty {i.qty} · {i.bv * i.qty} BV
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">₹{(i.price * i.qty).toLocaleString("en-IN")}</div>
                    <div className="text-xs text-muted-foreground">
                      ₹{i.price.toLocaleString("en-IN")} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <h3 className="font-display text-lg mb-4">Bill</h3>
            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={`₹${order.subtotal.toLocaleString("en-IN")}`} />
              <Row label="GST (18%)" value={`₹${order.gst.toLocaleString("en-IN")}`} />
              <Row label="Shipping" value={order.shipping === 0 ? "Free" : `₹${order.shipping}`} />
              <div className="border-t border-border mt-3 pt-3 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-mono font-semibold text-brass">
                  ₹{order.total.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">BV Credit</span>
                <span className="font-mono text-primary">{order.bvTotal} BV</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg">Ship to</h3>
            </div>
            <div className="text-sm">
              <div className="font-medium">{order.address.fullName}</div>
              <div className="text-muted-foreground">
                {order.address.line1}
                {order.address.line2 && `, ${order.address.line2}`}
              </div>
              <div className="text-muted-foreground">
                {order.address.city}, {order.address.state} {order.address.pincode}
              </div>
              <div className="text-muted-foreground mt-1">{order.address.phone}</div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg">Payment</h3>
            </div>
            <div className="text-sm">
              <div className="font-medium">{payLabel[order.payment] || order.payment}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Reference: PAY-{order.id.slice(-6)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline">
              <Link to="/dashboard/orders">All Orders</Link>
            </Button>
            <Button asChild className="bg-gradient-emerald text-primary-foreground shadow-glow">
              <Link
                to={order.type === "purchase" ? "/dashboard/purchase" : "/dashboard/repurchase"}
              >
                Buy Again
              </Link>
            </Button>
          </div>
        </div>
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
