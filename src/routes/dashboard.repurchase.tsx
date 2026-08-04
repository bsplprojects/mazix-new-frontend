import { Link } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ShoppingCartIcon,
  Images,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { cartStore, useCart } from "@/lib/cart-store";

import { useRepurchase } from "@/hooks/useRepurchase";
import Loader from "@/components/Loader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import type { Product } from "./dashboard.UserInfo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AxiosError } from "axios";

// fDate and tDate be 1 month
const fDate = new Date("1900-01-01");
const tDate = new Date();

export default function Repurchase() {
  const state = useCart();

  const [selectedWallet, setSelectedWallet] = useState<
    "Repurchase" | "Voucher"
  >("Repurchase");
  const [cart, setCart] = useState<Product[]>([]);
  const mid = sessionStorage.getItem("MID");
  const memberId = sessionStorage.getItem("memberID");
  const [search, setSearch] = useState("");

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/joining/products`);
      return res.data;
    },
  });

  const { data: walletAmount } = useQuery({
    queryKey: ["wallet-amount", selectedWallet],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/repurchase/rep-voucher?Prefix=${selectedWallet}&memberID=${memberId}`,
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

  const addToCart = (product: Product) => {
    setCart((prev: Product[]) => {
      const exist = prev.find((x: Product) => x.id === product.id);

      if (exist) {
        return prev.map((x: Product) =>
          x.id === product.id
            ? { ...x, qty: x.qty ? Number(x.qty) + 1 : 1 }
            : x,
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });

    toast.success(`${product.name} added`);
  };

  const setQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }

    setCart((prev: Product[]) =>
      prev.map((x: Product) => (x.id === id ? { ...x, qty } : x)),
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  };

  const totals = {
    items: cart,
    shipping: 0,
    total: 0,
    // GST INCLUDED PRICE
    subtotal: cart.reduce(
      (a, b) => a + (Number(b.price) || 0) * (Number(b.qty) || 0),
      0,
    ),

    bvTotal: cart.reduce(
      (a, b) => a + (Number(b.bv) || 0) * (Number(b.qty) || 0),
      0,
    ),

    gst: cart.reduce((a, b) => {
      const price = Number(b.price) || 0;
      const qty = Number(b.qty) || 0;
      const gstRate = Number(b.gst) || 0;

      const gstAmount = (price * gstRate) / 100;

      return a + gstAmount * qty;
    }, 0),
  };

  totals.shipping = 0;
  totals.total = totals.subtotal;

  const mutation = useMutation({
    mutationFn: async (mappedItems: Items[]) => {
      const res = await axiosInstance.post(
        `/repurchase/insert-rep?memberID=${memberId}&mid=${mid}`,
        {
          kotbills: mappedItems,
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      cartStore.clear("repurchase");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (selectedWallet === "Repurchase") {
      if (Number(walletAmount?.Repurchase) < Number(totals.total)) {
        toast.error("Insufficient wallet balance");
        return;
      }
    }

    if (selectedWallet === "Voucher") {
      if (Number(walletAmount?.Voucher) < Number(totals.total)) {
        toast.error("Insufficient wallet balance");
        return;
      }
    }

    const mappedItems = cart.map((c) => ({
      BV: String(c.bv),
      Flag: selectedWallet,
      MRP: String(c.price),
      NetAmount: String(Number(c.bv) * Number(c.qty)),
      Qty: String(c.qty),
      TotalAmount: String(Number(c.price) * Number(c.qty)),
      pCatID: String(c.catId),
      pID: String(c.id),
    }));

    mutation.mutate(mappedItems);
  };

  return (
    <div className="space-y-6 max-w-350 mx-auto">
      <PageHeader
        title="Repurchase"
        subtitle="Maintain monthly BV to stay active and continue earning bonuses"
      />

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
                        {p?.image === "📦" ? (
                          <div className="h-12 w-12 border flex items-center justify-center">
                            <Images className="text-primary/60" />
                          </div>
                        ) : (
                          <img
                            src={`https://app.mymazix.com/${p?.image.split("../../")[1]}`}
                            alt={p?.name}
                            loading="lazy"
                            width={50}
                          />
                        )}
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
                        onClick={() => addToCart(p)}
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
                <Link to="/dashboard/repurchase/history">View all</Link>
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
                  repurchaseHistory?.map((r: any, index: number) => (
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
        <div className="rounded-2xl bg-gradient-card border p-6 shadow-card h-fit lg:sticky lg:top-20">
          {/* ================= HEADER ================= */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg">Cart</h3>
            <Badge variant="outline">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30" />
              Your cart is empty
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-72 overflow-auto pr-1">
                {totals.items.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30"
                  >
                    <div className="text-2xl">{"📦"}</div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {i.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        ₹{i.price.toLocaleString("en-IN")} × {i.qty}
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5"
                            onClick={() => setQty(i.id, Number(i.qty) - 1)}
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </Button>
                          <span className="w-5 text-center text-[11px] font-mono">
                            {i.qty}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5"
                            onClick={() => setQty(i.id, Number(i.qty) + 1)}
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(i.id)}
                      className="text-muted-foreground hover:text-destructive transition-smooth self-start"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <Label className="mt-5 pl-2 mb-1">Select Wallet</Label>
              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger className="w-full ">
                  <SelectValue placeholder="Select a Wallet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Repurchase">Repurchase</SelectItem>
                  <SelectItem value="Voucher">Voucher</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 justify-between text-sx text-primary border mt-3 p-1 rounded-full px-4">
                <h2>
                  {selectedWallet === "Repurchase"
                    ? "Repurchase"
                    : "Voucher"}{" "}
                </h2>
                <p>
                  {selectedWallet === "Repurchase"
                    ? walletAmount?.Repurchase
                    : walletAmount?.Voucher}
                </p>
              </div>

              {/* TOTALS */}
              <div className="space-y-2 text-sm mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totals.subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST</span>
                  <span>₹{totals.gst.toLocaleString("en-IN")}</span>
                </div>

                {/* <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {totals.shipping === 0 ? "Free" : `₹${totals.shipping}`}
                  </span>
                </div> */}

                <div className="flex justify-between">
                  <span>BV Credit</span>
                  <span className="text-primary">{totals.bvTotal} BV</span>
                </div>

                <div className="flex justify-between font-semibold text-base border-t pt-2">
                  <span>Total</span>
                  <span>₹{totals.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Button onClick={handleCheckout} className="w-full mt-4">
                Purchase
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
