import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { http } from "@/config/http";
import { useCart } from "@/context/CartContext";
import { useMember } from "@/hooks/use-member";
import { useToast } from "@/hooks/use-toast";
import type { OrderDTO } from "@/types/order";
import type { CartItem } from "@/types/product";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Shield,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Coupon = {
  type: "percentage" | "flat";
  value: number;
  minOrder: number;
  description: string;
};

// Available coupon codes
const COUPONS = {
  WELCOME10: {
    type: "percentage",
    value: 10,
    minOrder: 0,
    description: "10% off",
  },
  FLAT50: {
    type: "flat",
    value: 50,
    minOrder: 299,
    description: "₹50 off on orders above ₹299",
  },
  SAVE100: {
    type: "flat",
    value: 100,
    minOrder: 599,
    description: "₹100 off on orders above ₹599",
  },
  HERBAL20: {
    type: "percentage",
    value: 20,
    minOrder: 999,
    description: "20% off on orders above ₹999",
  },
};

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [payType, setPayType] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const [formData, setFormData] = useState({
    memberId: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const { data } = useMember(formData.memberId);

  useEffect(() => {
    if (data?.data) {
      setFormData((prev) => ({
        ...prev,
        fullName: data?.data?.MemberName,
        phone: data?.data?.ContactNo,
        address: data?.data?.Address,
        email: data?.data?.EmailID,
        state: data?.data?.ExtraFD,
        pincode: data?.data?.Pincode,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        fullName: "",
        phone: "",
        address: "",
        email: "",
        state: "",
        pincode: "",
      }));
    }
  }, [data]);

  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const coupon = COUPONS[appliedCoupon];
    if (coupon.type === "percentage") {
      return Math.round((totalPrice * coupon.value) / 100);
    }
    return coupon.value;
  };

  const discount = calculateDiscount();
  const discountedTotal = totalPrice - discount;
  const shippingCost = discountedTotal >= 499 ? 0 : 49;
  const finalTotal = discountedTotal + shippingCost;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    setCouponError("");

    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const coupon = COUPONS[code];
    if (!coupon) {
      setCouponError("Invalid coupon code");
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      });
      return;
    }

    if (totalPrice < coupon.minOrder) {
      setCouponError(`Minimum order of ₹${coupon.minOrder} required`);
      toast({
        title: "Minimum Order Not Met",
        description: `Add ₹${
          coupon.minOrder - totalPrice
        } more to use this coupon.`,
        variant: "destructive",
      });
      return;
    }

    setAppliedCoupon(code);
    setCouponCode("");
    toast({
      title: "Coupon Applied!",
      description: `${coupon.description} has been applied to your order.`,
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from your order.",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field]?.trim(),
    );

    if (emptyFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;

    try {
      setPayType("razorpay");
      setIsProcessing(true);

      //  Create order (send amount in paise, backend converts)
      const res = await http.post("/CreateOrder", {
        Amount: finalTotal * 100,
        currency: "INR",
      });

      const razorpayOrderId = res.data?.order?.id;

      if (!razorpayOrderId) {
        throw new Error("Failed to create Razorpay order");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data?.order?.amount, // use backend amount
        currency: res.data?.order?.currency,
        name: "Mazix",
        description: `Order Payment for ${items.length} item(s)`,
        order_id: razorpayOrderId,

        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            const verifyRes = await http.post("/VerifyOrder", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (!verifyRes.data?.success) {
              throw new Error("Payment verification failed");
            }

            const orderId = "ORD" + Date.now().toString().slice(-8);

            const orderData = {
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              memberId: formData.memberId,
              fullName: formData.fullName,
              items,
              totalPrice,
              discount,
              appliedCoupon,
              shippingCost,
              finalTotal,
              shippingInfo: formData,
              paymentMethod: "razorpay",
              orderDate: new Date().toISOString(),
            };

            mutation.mutate(orderData);
          } catch (err) {
            toast({
              title: "Payment Failed",
              description: err.message,
              variant: "destructive",
            });
          }
        },

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },

        theme: { color: "#2E7D32" },

        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        });
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: OrderDTO) => {
      const res = await http.post("/OrderDetailInsert", {
        UserID: data.memberId,
        Name: data?.fullName,
        Address: data?.address,
        City: data?.city,
        State: data?.state,
        Pincode: data?.pincode,
        Phone: data?.phone,
        Email: data?.email,
        Items: items,
        PayMode: payType,
        Status: "Pending",
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Order Placed Successfully!",
        description: "You will pay on delivery.",
      });
      clearCart();
      navigate("/order-confirmation", {
        state: { order: { ...formData, ...data, shippingCost: 43 } },
      });
    },
  });

  const handleCODOrder = async () => {
    if (!validateForm()) return;

    mutation.mutate(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else {
      handleCODOrder();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some products to continue with checkout.
          </p>
          <Link to="/products">
            <Button variant="default">Browse Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-28 pb-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Checkout</span>
        </nav>
      </div>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/products"
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Checkout
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        Membership ID (Optional)
                      </Label>
                      <Input
                        id="memberId"
                        name="memberId"
                        value={formData.memberId}
                        onChange={handleInputChange}
                        placeholder="Enter Member Id"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter 10-digit phone"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter full address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-card">
                  <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-xl hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label
                        htmlFor="razorpay"
                        className="flex-1 cursor-pointer"
                      >
                        <span className="font-medium">
                          Pay Online (Razorpay)
                        </span>
                        <p className="text-sm text-muted-foreground">
                          UPI, Cards, Net Banking, Wallets
                        </p>
                      </Label>
                    </div>
                    {/* <div className="flex items-center space-x-3 p-4 border border-border rounded-xl hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-muted-foreground">
                          Pay when you receive your order
                        </p>
                      </Label>
                    </div> */}
                  </RadioGroup>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl p-6 shadow-card sticky top-28">
                  <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {items?.map((item: CartItem) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.weight} × {item.quantity}
                          </p>
                          <p className="font-semibold text-primary">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Section */}
                  {/* <div className="mb-4 pb-4 border-b border-border">
                    <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-primary" />
                      Coupon Code
                    </Label>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
                        <div>
                          <span className="font-medium text-primary">
                            {appliedCoupon}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {COUPONS[appliedCoupon].description}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveCoupon}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponError("");
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleApplyCoupon}
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                    {couponError && (
                      <p className="text-xs text-destructive mt-1">
                        {couponError}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Try: WELCOME10, FLAT50, SAVE100, HERBAL20
                    </p>
                  </div> */}

                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-primary">
                        <span>Discount ({appliedCoupon})</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span
                        className={
                          shippingCost === 0 ? "text-primary font-medium" : ""
                        }
                      >
                        {shippingCost === 0 ? "Free" : `₹${shippingCost}`}
                      </span>
                    </div>
                    {discountedTotal < 499 && (
                      <p className="text-xs text-secondary">
                        Add ₹{499 - discountedTotal} more for free shipping
                      </p>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">₹{finalTotal}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Processing..." : "Place Order"}
                  </Button>

                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      Secure
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      Fast Delivery
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
