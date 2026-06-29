import { AlertCircle, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";

import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import * as joiningApi from "@/services/joiningApi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-gradient-card border p-6 shadow-card">
      <h3 className="font-display text-xl">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-foreground">{label}</p>
      {children}
    </div>
  );
}

export default function UserInfo() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    SponsorID: "",
    Placement: "",
    Leaf: "",
    MemberName: "",
    GuardianName: "",
    Gender: "",
    Age: "",
    Address: "",
    District: "",
    CityID: "",
    StateID: "",
    Country: "India",
    CountryID: 1,
    Pincode: "",
    Mobile: "",
    AltMobile: "",
    Aadhar: "",
    PAN: "",
    Email: "",
  });
  const memberId = sessionStorage.getItem("memberID");
  const [checkingSponsor, setCheckingSponsor] = useState(false);
  const [sponsorValid, setSponsorValid] = useState<boolean | null>(null);
  const [sponsorName, setSponsorName] = useState("");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  const loadCities = async (stateId: number) => {
    const data = await joiningApi.getCities(stateId);
    setCities(data);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchStates = async () => {
      try {
        const data = await joiningApi.getStates();

        if (isMounted) {
          setStates(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStates();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await joiningApi.getProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Product Load Error", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const MID = "MAZ094982";
        const MemberID = "MAZ094982";

        const data = await joiningApi.getMemberDashboard(MID, MemberID);

        if (isMounted) {
          setDashboard(data);
        }
      } catch (err) {
        console.error("Dashboard Error", err);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const addToCart = (product: any) => {
    setCart((prev: any) => {
      const exist = prev.find((x: any) => x.id === product.id);

      if (exist) {
        return prev.map((x: any) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x,
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });

    toast.success(`${product.name} added`);
  };

  const setQty = (id, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }

    setCart((prev: any) =>
      prev.map((x: any) => (x.id === id ? { ...x, qty } : x)),
    );
  };

  const removeItem = (id: any) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  };

  const totals = {
    items: cart,

    // GST INCLUDED PRICE
    subtotal: cart.reduce(
      (a, b) => a + (Number(b.price) || 0) * (Number(b.qty) || 0),
      0,
    ),

    bvTotal: cart.reduce(
      (a, b) => a + (Number(b.bv) || 0) * (Number(b.qty) || 0),
      0,
    ),

    // Reverse GST extraction
    gst: cart.reduce((a, b) => {
      const price = Number(b.price) || 0;
      const qty = Number(b.qty) || 0;
      const gstRate = Number(b.gst) || 0;

      const gstAmount = price - price / (1 + gstRate / 100);

      return a + gstAmount * qty;
    }, 0),
  };

  totals.shipping = 0;
  totals.total = totals.subtotal;
  const avgGST =
    totals.subtotal > 0 ? ((totals.gst / totals.subtotal) * 100).toFixed(2) : 0;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (!form.SponsorID) {
      setSponsorValid(null);
      setSponsorName("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setCheckingSponsor(true);

        const res = await joiningApi.checkSponsor(form.SponsorID);

        setSponsorValid(true);
        setSponsorName(res.MemberName);
      } catch (err) {
        setSponsorValid(false);
        setSponsorName("");
      } finally {
        setCheckingSponsor(false);
      }
    }, 600); // debounce delay

    return () => clearTimeout(timer);
  }, [form.SponsorID]);

  const buildPayload = () => ({
    sessionId: memberId,
    member: form,
    products: cart.map((p) => ({
      ProductID: p.id,
      ProductName: p.name,
      MRP: p.price,
      BV: p.bv,
      Qty: p.qty,
    })),
  });

  const validateForm = () => {
    if (!form.SponsorID) return "Sponsor ID required";
    if (!form.Placement) return "Placement required";
    if (!form.MemberName) return "Member Name required";
    if (!form.Age) return "Age required";
    if (!form.StateID) return "State required";
    if (!form.Mobile) return "Contact No required";

    if (cart.length === 0) return "At least 1 product required";

    return null;
  };

  const registerMember = async () => {
    try {
      const error = validateForm();
      if (error) {
        toast.error(error);
        return;
      }

      const payload = buildPayload();

      const data = await joiningApi.registerJoining(payload);

      if (!data) {
        toast.error("No response from server");
        return;
      }

      if (data.success === false) {
        toast.error(data.message || "Registration failed");
        return;
      }

      // SUCCESS
      toast.success(data.message || "Member registered successfully");
    } catch (err) {
      console.error("ERROR:", err);
      toast.error("Registration failed");
    }
  };

  return (
    <div className="space-y-6 max-w-350 mx-auto">
      {/* HEADER */}
      <PageHeader
        title="Joining"
        subtitle="Complete joining registration & activation"
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-4">
          {/* ALERT */}
          <div className="rounded-2xl bg-gradient-hero border p-6">
            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 text-brass mb-2">
                  <AlertCircle size={16} />
                  <span className="text-xs uppercase">Action Needed</span>
                </div>

                <h3 className="text-2xl font-display">Joining Activation</h3>

                <p className="text-sm text-muted-foreground">
                  Complete joining purchase to activate account.
                </p>
              </div>
            </div>
          </div>

          {/* JOINING FORM */}
          <SectionCard
            title="Joining Registration"
            description="Fill member joining details"
          >
            <div className="grid md:grid-cols-3 gap-4">
              {/* Sponsor ID */}
              <Field label="Sponsor ID">
                <Input
                  placeholder="Sponsor ID"
                  value={form.SponsorID || ""}
                  onChange={(e) =>
                    setForm({ ...form, SponsorID: e.target.value })
                  }
                />

                {checkingSponsor && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Checking sponsor...
                  </p>
                )}

                {sponsorValid === true && (
                  <p className="text-xs text-green-600 mt-1">
                    ✅ {sponsorName}
                  </p>
                )}

                {sponsorValid === false && (
                  <p className="text-xs text-red-500 mt-1">
                    ❌ Invalid Sponsor ID
                  </p>
                )}
              </Field>

              {/* Placement */}
              <Field label="Placement">
                <Select
                  value={form.Placement}
                  onValueChange={(v) => setForm({ ...form, Placement: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Left">Position 1</SelectItem>
                    <SelectItem value="Right">Position 2</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {/* Member Name */}
              <Field label="Member Name">
                <Input
                  placeholder="Member Name"
                  value={form.MemberName || ""}
                  onChange={(e) =>
                    setForm({ ...form, MemberName: e.target.value })
                  }
                />
              </Field>

              {/* Guardian Name */}
              <Field label="Guardian Name">
                <Input
                  placeholder="Guardian Name"
                  value={form.GuardianName || ""}
                  onChange={(e) =>
                    setForm({ ...form, GuardianName: e.target.value })
                  }
                />
              </Field>

              {/* Gender */}
              <Field label="Gender">
                <Select
                  value={form.Gender}
                  onValueChange={(v) => setForm({ ...form, Gender: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Transgender">Transgender</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {/* Age */}
              <Field label="Age">
                <Input
                  placeholder="Like: 44 Year"
                  value={form.Age || ""}
                  onChange={(e) => setForm({ ...form, Age: e.target.value })}
                />
              </Field>

              {/* Address */}
              <Field label="Address">
                <Input
                  placeholder="Full Address"
                  value={form.Address || ""}
                  onChange={(e) =>
                    setForm({ ...form, Address: e.target.value })
                  }
                />
              </Field>

              {/* Pincode */}
              <Field label="Pincode">
                <Input
                  placeholder="Pincode"
                  value={form.Pincode || ""}
                  onChange={(e) =>
                    setForm({ ...form, Pincode: e.target.value })
                  }
                />
              </Field>

              {/* State */}
              <Field label="State">
                <Select
                  value={form.StateID}
                  onValueChange={(v) => {
                    setForm({ ...form, StateID: v });
                    loadCities(v);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>

                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* District */}
              <Field label="District">
                <Select
                  value={form.CityID}
                  onValueChange={(v) => setForm({ ...form, CityID: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>

                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Country */}
              <Field label="Country">
                <Select
                  value={form.Country || "India"}
                  onValueChange={(v) => setForm({ ...form, Country: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {/* Contact No */}
              <Field label="Contact No">
                <Input
                  placeholder="Contact No"
                  value={form.Mobile || ""}
                  onChange={(e) => setForm({ ...form, Mobile: e.target.value })}
                />
              </Field>

              {/* Alt Contact */}
              <Field label="Alt Contact No">
                <Input
                  placeholder="Alt Contact No"
                  value={form.AltMobile || ""}
                  onChange={(e) =>
                    setForm({ ...form, AltMobile: e.target.value })
                  }
                />
              </Field>

              {/* Aadhaar */}
              <Field label="Aadhar No">
                <Input
                  placeholder="Aadhar No"
                  value={form.Aadhar || ""}
                  onChange={(e) => setForm({ ...form, Aadhar: e.target.value })}
                />
              </Field>

              {/* PAN */}
              <Field label="PAN">
                <Input
                  placeholder="PAN"
                  value={form.PAN || ""}
                  onChange={(e) => setForm({ ...form, PAN: e.target.value })}
                />
              </Field>

              {/* Email */}
              <Field label="Email">
                <Input
                  type="email"
                  placeholder="Email"
                  value={form.Email || ""}
                  onChange={(e) => setForm({ ...form, Email: e.target.value })}
                />
              </Field>
            </div>
          </SectionCard>

          {/* PRODUCTS */}
          <div className="rounded-2xl bg-gradient-card border p-6">
            {/* <h3 className="font-display text-xl mb-4">Joining Products</h3> */}
            <div className="mb-4">
              <Input
                placeholder="Search joining product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="text-center py-10 text-muted-foreground">
                Loading Products...
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {filteredProducts.map((p) => {
                  const inCart = cart.find((c) => c.id === p.id);

                  return (
                    <div
                      key={p.id}
                      className="
                          flex justify-between items-center
                          p-3 rounded-lg
                          bg-secondary/30
                          hover:bg-secondary/50
                          transition
                         "
                    >
                      {/* PRODUCT INFO */}
                      <div className="flex items-center gap-3">
                        <div className="text-xl">
                          <img
                            width={50}
                            src={`https://new.mazix.co.in/${p.image.split("../../")[1]}`}
                          />
                        </div>

                        <div>
                          <div className="text-sm font-medium">{p.name}</div>

                          <div className="text-xs text-muted-foreground">
                            {p.bv} BV · ₹{p.price.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      {/* CART ACTION */}
                      {inCart ? (
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setQty(p.id, inCart.qty - 1)}
                          >
                            <Minus size={14} />
                          </Button>

                          <span className="w-6 text-center">{inCart.qty}</span>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setQty(p.id, inCart.qty + 1)}
                          >
                            <Plus size={14} />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeItem(p.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(p)}
                        >
                          <Plus size={14} />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT CART ================= */}

        <div className="rounded-2xl bg-gradient-card border p-6 shadow-card h-fit lg:sticky lg:top-20">
          {/* ================= HEADER ================= */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg">Joining Cart</h3>
            <Badge variant="outline">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {/* ================= WALLET SECTION ================= */}

          <div className="mb-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
              Wallet Overview
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* AMOUNT CARD */}
              <div
                className="
                  relative overflow-hidden
                  rounded-xl border border-primary/20
                  bg-gradient-to-br from-primary/10 to-primary/5
                  p-4
                  transition-all
                  hover:shadow-lg
                  hover:scale-[1.02]
            "
              >
                <p className="text-xs text-muted-foreground mb-1">
                  Total Amount
                </p>

                <p className="text-xl font-semibold text-primary">
                  ₹{dashboard?.CurrentWallet ?? 0}
                </p>

                <span className="text-[11px] text-emerald-600">
                  Available Balance
                </span>
              </div>

              {/* BV CARD */}
              <div
                className="
      relative overflow-hidden
      rounded-xl border
      bg-gradient-to-br from-emerald-500/10 to-emerald-500/5
      p-4
      transition-all
      hover:shadow-lg
      hover:scale-[1.02]
    "
              >
                <p className="text-xs text-muted-foreground mb-1">Total BV</p>

                <p className="text-xl font-semibold text-emerald-600">
                  {Math.floor((dashboard?.CurrentWallet ?? 0) / 5)} BV
                </p>

                <span className="text-[11px] text-muted-foreground">
                  Business Volume
                </span>
              </div>
            </div>
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
                            onClick={() => setQty(i.id, i.qty - 1)}
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
                            onClick={() => setQty(i.id, i.qty + 1)}
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

              {/* TOTALS */}
              <div className="space-y-2 text-sm mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totals.subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST ({avgGST}%)</span>
                  <span>₹{totals.gst.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {totals.shipping === 0 ? "Free" : `₹${totals.shipping}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>BV Credit</span>
                  <span className="text-primary">{totals.bvTotal} BV</span>
                </div>

                <div className="flex justify-between font-semibold text-base border-t pt-2">
                  <span>Total</span>
                  <span>₹{totals.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Button
                onClick={registerMember}
                className="w-full mt-4"
                disabled={
                  !form.SponsorID ||
                  !form.Placement ||
                  !form.MemberName ||
                  !form.Age ||
                  !form.StateID ||
                  !form.Mobile ||
                  cart.length === 0
                }
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
