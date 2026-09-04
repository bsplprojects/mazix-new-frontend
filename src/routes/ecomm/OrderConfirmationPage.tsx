import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Truck, Home, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (location.state?.order) {
      setOrderData(location.state.order);
    } else {
      navigate("/");
    }
  }, [location.state, navigate]);

  if (!orderData) {
    return null;
  }

  const {
    address,
    Items,
    city,
    email,
    fullName,

    phone,
    pincode,
    state,
    OrderID,
    TotalAmount,
    shippingCost,
    OrderDate,
    Paymode,
  } = orderData;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-28 pb-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Order Confirmation</span>
        </nav>
      </div>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-muted-foreground">
                Thank you for your order. We've sent a confirmation to your
                email.
              </p>
              <p className="text-sm text-primary font-medium mt-2">
                Order ID: {OrderID}
              </p>
              <p className="text-sm text-primary font-medium mt-2">
                Date: {OrderDate?.split("T")[0]}
              </p>
            </div>

            {/* Order Status */}
            <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Order Confirmed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Processing your order
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                  <div className="h-0.5 w-16 bg-border"></div>
                  <Truck className="h-5 w-5" />
                  <div className="h-0.5 w-16 bg-border"></div>
                  <Home className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Ordered Products */}
            <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
              <h2 className="text-xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Ordered Products ({Items?.length})
              </h2>

              <div className="space-y-4">
                {Items?.map((item) => (
                  <div
                    key={item.ItemID}
                    className="flex gap-4 p-4 bg-muted/30 rounded-xl"
                  >
                    <img
                      src={
                        item?.Image
                          ? `https://new.mazix.co.in/Uploads/${
                              item.Image.split("/Uploads")[1]
                            }`
                          : "https://via.placeholder.com/150"
                      }
                      alt={item?.ItemName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {item?.ItemName}
                      </h4>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-muted-foreground">
                          Qty: {item?.Qty}
                        </p>
                        <p className="font-semibold text-primary">
                          ₹{item?.SaleRate * item?.Qty}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{TotalAmount - shippingCost}</span>
                </div>
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
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">₹{TotalAmount}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Shipping Address
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="text-foreground font-medium">{fullName}</p>
                  <p>{address}</p>
                  <p>
                    {city}, {state} - {pincode}
                  </p>
                  <p>Phone: {phone}</p>
                  <p>Email: {email}</p>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h3 className="font-semibold text-foreground mb-3">
                  Payment Method
                </h3>
                <p className="text-sm text-muted-foreground">
                  {Paymode === "COD" ? "Cash on Delivery" : "Online Payment"}
                </p>
                <p className="text-xs text-secondary mt-2">
                  {Paymode === "COD" &&
                    "Pay ₹" + TotalAmount + " when you receive your order"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button variant="outline" size="lg">
                  Continue Shopping
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
