import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Check, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/mock-data";
import { cartStore, useCart, cartTotals, type OrderType } from "@/lib/cart-store";

export const Route = createFileRoute("/dashboard/purchase")({
  component: Purchase,
});

function Purchase() {
  const state = useCart();
  const navigate = useNavigate();
  const totals = cartTotals(state.purchase.cart);

  const handleAdd = (id: string, name: string) => {
    cartStore.add("purchase", id);
    toast.success(`${name} added to purchase cart`);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Purchase"
        subtitle="Activate or upgrade your kit · earns full BV credit on both legs"
        action={
          state.purchase.cart.length > 0 ? (
            <Button
              onClick={() => navigate({ to: "/dashboard/checkout", search: { kind: "purchase" } })}
              className="bg-gradient-brass text-brass-foreground shadow-brass hover:opacity-90"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Checkout · ₹{totals.total.toLocaleString("en-IN")}
            </Button>
          ) : null
        }
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          {products.map((p) => {
            const inCart = state.purchase.cart.find((c) => c.productId === p.id);
            return (
              <div
                key={p.id}
                className="group rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card transition-smooth hover:border-primary/50 hover:shadow-glow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{p.image}</div>
                  <Badge variant="outline" className="border-brass/40 text-brass bg-brass/5">
                    {p.tier}
                  </Badge>
                </div>
                <h3 className="font-display text-xl mb-1">{p.name}</h3>
                <div className="text-xs font-mono text-muted-foreground mb-4">{p.id}</div>

                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-mono">₹{p.price.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">BV Credit</span>
                    <span className="font-mono text-primary">{p.bv} BV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Direct Bonus</span>
                    <span className="font-mono text-brass">
                      ₹{(p.price * 0.1).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {inCart ? (
                  <div className="flex items-center justify-between gap-2 mt-5">
                    <div className="flex items-center gap-2 rounded-lg border border-border p-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => cartStore.setQty("purchase", p.id, inCart.qty - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-mono">{inCart.qty}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => cartStore.setQty("purchase", p.id, inCart.qty + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cartStore.remove("purchase", p.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleAdd(p.id, p.name)}
                    className="w-full mt-5 bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <CartSummary kind="purchase" />
      </div>

      <div className="rounded-2xl bg-gradient-hero border border-border/60 p-8 shadow-elegant relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-emerald opacity-50" />
        <div className="relative grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="font-display text-2xl mb-2">How purchase BV flows</h3>
            <p className="text-sm text-muted-foreground">
              Every purchase you and your downline make adds Business Volume (BV) to your binary
              legs. The lesser leg gets matched and pays out at your binary commission percentage.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "100% BV credit to your sponsor leg",
              "10% direct purchase bonus to your sponsor",
              "BV pairs across legs trigger binary payout",
              "Activates monthly rank qualification",
            ].map((b) => (
              <div key={b} className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-gradient-emerald flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartSummary({ kind }: { kind: OrderType }) {
  const state = useCart();
  const navigate = useNavigate();
  const cart = state[kind].cart;
  const totals = cartTotals(cart);
  const label = kind === "purchase" ? "Purchase" : kind === "joining" ? "Joining" : "Repurchase";
  return (
    <div className="rounded-2xl bg-gradient-card border border-border/60 p-6 shadow-card h-fit lg:sticky lg:top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg">{label} Cart</h3>
        <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5">
          {cart.length} item{cart.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30" />
          Your {label.toLowerCase()} cart is empty
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-72 overflow-auto pr-1">
            {totals.items.map((i) => (
              <div key={i.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                <div className="text-2xl">{i.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{i.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    ₹{i.price.toLocaleString("en-IN")} × {i.qty}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5"
                        onClick={() => cartStore.setQty(kind, i.id, i.qty - 1)}
                      >
                        <Minus className="h-2.5 w-2.5" />
                      </Button>
                      <span className="w-5 text-center text-[11px] font-mono">{i.qty}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5"
                        onClick={() => cartStore.setQty(kind, i.id, i.qty + 1)}
                      >
                        <Plus className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => cartStore.remove(kind, i.id)}
                  className="text-muted-foreground hover:text-destructive transition-smooth self-start"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm mt-4 pt-4 border-t border-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono">₹{totals.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="font-mono">₹{totals.gst.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-mono">
                {totals.shipping === 0 ? "Free" : `₹${totals.shipping}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">BV Credit</span>
              <span className="font-mono text-primary">{totals.bvTotal} BV</span>
            </div>
            <div className="flex justify-between text-base pt-2 border-t border-border mt-2">
              <span className="font-medium">Total</span>
              <span className="font-mono font-semibold text-brass">
                ₹{totals.total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <Button
            onClick={() => navigate({ to: "/dashboard/checkout", search: { kind } })}
            className="w-full mt-5 bg-gradient-emerald text-primary-foreground shadow-glow hover:opacity-90"
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </div>
  );
}
