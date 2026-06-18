import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  cartStore,
  useCart,
  cartTotals,
  type OrderType,
} from "@/lib/cart-store";

import { useRepurchase } from "@/hooks/useRepurchase";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// fDate and tDate be 1 month
const fDate = new Date("1900-01-01");
const tDate = new Date();

export default function Repurchase() {
  const state = useCart();
  const memberId = sessionStorage.getItem("memberID");
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/joining/products`);
      return res.data;
    },
  });

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/member/dashboard?MemberID=${memberId}`,
      );
      return res.data;
    },
  });

  const products = data;
  const filteredProducts = products?.filter((product: any) => {
    return product?.name?.toLowerCase()?.includes(search.toLowerCase());
  });

  const { repurchaseHistory, isLoading } = useRepurchase({
    fDate,
    tDate,
    limit: 5,
  });

  const quickAdd = (id: string, name: string) => {
    cartStore.add("repurchase", id);
    toast.success(`${name} added to cart`);
  };

  console.log(filteredProducts);

  return (
    <div className="space-y-6 max-w-350 mx-auto">
      <PageHeader
        title="Repurchase"
        subtitle="Maintain monthly BV to stay active and continue earning bonuses"
      />

      <div className="my-6 p-4 flex items-center gap-10">
        <div>
          <h3 className="text-zinc-300">Rep. Wallet</h3>
          <p className="text-2xl text-primary">
            ₹{wallet?.data?.CurrentRepWallet ?? 0}
          </p>
        </div>

        <div>
          <h3 className="text-zinc-300">Voucher Wallet</h3>
          <p className="text-2xl text-primary">₹{wallet?.data?.Voucher ?? 0}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          {/* PRODUCTS */}
          <div className="rounded-2xl bg-gradient-card border p-6 shadow-card ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">Quick Repurchase</h3>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                placeholder="search"
                className="w-1/2"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {filteredProducts?.map((p: any) => {
                const inCart = state.repurchase.cart.find(
                  (c) => c.productId === p?.id,
                );

                return (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-secondary/30"
                  >
                    <div className="flex gap-3">
                      <div className="text-2xl">
                        <img
                          src={`https://new.mazix.co.in/${p?.image.split("../../")[1]}`}
                          alt={p?.name}
                          width={50}
                        />
                      </div>

                      <div>
                        <div className="text-sm font-medium">{p?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p?.bv} BV · ₹{p?.price?.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() =>
                            cartStore.setQty(
                              "repurchase",
                              p?.id,
                              inCart.qty - 1,
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <span className="w-5 text-center text-xs">
                          {inCart.qty}
                        </span>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() =>
                            cartStore.setQty(
                              "repurchase",
                              p?.id,
                              inCart.qty + 1,
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive"
                          onClick={() => cartStore.remove("repurchase", p?.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => quickAdd(p?.id, p?.name)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* HISTORY */}
          <div className="rounded-2xl bg-gradient-card border shadow-card overflow-hidden">
            <div className="p-6 border-b flex justify-between">
              <h2 className="font-display text-xl">Repurchase History</h2>

              <Button asChild variant="default" size="sm">
                <Link to="/dashboard/orders">View all</Link>
              </Button>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Order No</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Member ID</th>
                  <th className="px-6 py-3 text-right">Total Amount</th>
                  <th className="px-6 py-3 text-right">BV</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <Loader />
                ) : repurchaseHistory?.length > 0 ? (
                  repurchaseHistory?.map((r, index: number) => (
                    <tr key={index} className="hover:bg-accent/30">
                      <td className="px-6 py-4 font-mono text-xs">
                        {r?.OrderNo}
                      </td>

                      <td className="px-6 py-4">
                        {r?.OrderDate?.split("T")[0]}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {r?.MemberID}
                      </td>

                      <td className="px-6 py-4 text-right">
                        ₹{r?.TotalAmount}
                      </td>

                      <td className="px-6 py-4 text-right font-mono">
                        ₹{r?.TotalBV}
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {r?.Status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-muted-foreground"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT CART SUMMARY */}
        <CartSummary kind="repurchase" products={products} />
      </div>
    </div>
  );
}

/* ======================================================
   CART SUMMARY (SAME PAGE)
====================================================== */

function CartSummary({ kind, products }: { kind: OrderType; products: any[] }) {
  const state = useCart();

  const cart = state[kind].cart;
  const totals = cartTotals(cart, products);

  return (
    <div className="rounded-2xl bg-gradient-card border p-6 shadow-card h-fit lg:sticky lg:top-20">
      <div className="flex justify-between mb-4">
        <h3 className="font-display text-lg">Cart</h3>

        <Badge variant="outline">
          {cart.length} item{cart.length !== 1 && "s"}
        </Badge>
      </div>

      {cart.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-10">
          <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30" />
          Cart empty
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-72 overflow-auto">
            {totals.items.map((i) => (
              <div
                key={i.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30"
              >
                <div className="text-2xl">
                  <img
                    src={`https://new.mazix.co.in/${i?.image.split("../../")[1]}`}
                    alt={i?.name}
                    width={50}
                  />
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium">{i.name}</div>

                  <div className="text-xs">
                    ₹{i.price.toLocaleString("en-IN")} × {i.qty}
                  </div>
                </div>

                <button
                  onClick={() => cartStore.remove(kind, i.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2 mt-4 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">
                ₹{totals.subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST</span>
              <span className="font-semibold">
                ₹{totals.gst.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold">
                ₹{totals.shipping.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between text-primary">
              <span>Total</span>
              <span className="font-semibold">
                ₹{totals.total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <Button
            onClick={() => alert("This feature is not available yet")}
            className="w-full mt-5 bg-gradient-emerald"
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </div>
  );
}
