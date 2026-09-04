import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Your Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Your cart is empty
            </h3>
            <p className="text-muted-foreground mb-6">
              Add some products to get started!
            </p>
            <Button
              variant="default"
              onClick={() => setIsCartOpen(false)}
              asChild
            >
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-muted/30 rounded-xl p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.weight}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-primary">
                        ₹{item.price}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{item.mrp}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border border-border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1.5 hover:bg-muted transition-colors rounded-l-lg"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1.5 hover:bg-muted transition-colors rounded-r-lg"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border py-4 space-y-4 px-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{totalPrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-primary">
                    {totalPrice >= 499 ? "Free" : "₹49"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">
                    ₹{totalPrice >= 499 ? totalPrice : totalPrice + 49}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="default"
                  className="w-full"
                  size="lg"
                  onClick={() => setIsCartOpen(false)}
                  asChild
                >
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
