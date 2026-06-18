import { useSyncExternalStore } from "react";
import { products, repurchaseHistory as seedRepurchase } from "./mock-data";

export type OrderType = "purchase" | "repurchase" | "joining";
export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered";

export type CartItem = {
  productId: string;
  qty: number;
};

export type Address = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type PaymentMethod = "wallet" | "upi" | "card" | "netbanking" | "cod";

export type Order = {
  id: string;
  type: OrderType;
  date: string;
  items: {
    productId: string;
    name: string;
    qty: number;
    price: number;
    bv: number;
  }[];
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
  bvTotal: number;
  payment: PaymentMethod;
  address: Address;
  status: OrderStatus;
};

type Channel = {
  cart: CartItem[];
  address: Address;
  payment: PaymentMethod;
};

type State = {
  purchase: Channel;
  repurchase: Channel;
  joining: Channel;
  orders: Order[];
};

const defaultAddress: Address = {
  fullName: "Aarav Mehta",
  phone: "+91 98201 12345",
  line1: "B-403, Skyline Heights",
  line2: "Andheri West",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400058",
};

const seedOrders: Order[] = seedRepurchase.map((r) => {
  const product = products.find((p) => p.name === r.product) || products[0];
  return {
    id: r.id,
    type: "repurchase" as OrderType,
    date: r.date,
    items: [
      {
        productId: product.id,
        name: r.product,
        qty: 1,
        price: r.amount,
        bv: r.bv,
      },
    ],
    subtotal: r.amount,
    gst: Math.round(r.amount * 0.18),
    shipping: 0,
    total: r.amount + Math.round(r.amount * 0.18),
    bvTotal: r.bv,
    payment: "wallet",
    address: defaultAddress,
    status: "Delivered",
  };
});

let state: State = {
  purchase: { cart: [], address: defaultAddress, payment: "wallet" },
  repurchase: { cart: [], address: defaultAddress, payment: "wallet" },
  joining: { cart: [], address: defaultAddress, payment: "wallet" },

  orders: seedOrders,
};

const listeners = new Set<() => void>();
const emit = () => {
  // Create a new top-level snapshot so useSyncExternalStore detects the change
  state = {
    purchase: { ...state.purchase, cart: [...state.purchase.cart] },
    repurchase: { ...state.repurchase, cart: [...state.repurchase.cart] },
    joining: { ...state.joining, cart: [...state.joining.cart] },
    orders: state.orders,
  };
  listeners.forEach((l) => l());
};

export const cartStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get() {
    return state;
  },
  add(type: OrderType, productId: string, qty = 1) {
    const ch = state[type];
    const ex = ch.cart.find((c) => c.productId === productId);
    if (ex) ex.qty += qty;
    else ch.cart.push({ productId, qty });
    emit();
  },
  remove(type: OrderType, productId: string) {
    state[type].cart = state[type].cart.filter(
      (c) => c.productId !== productId,
    );
    emit();
  },
  setQty(type: OrderType, productId: string, qty: number) {
    const ch = state[type];
    const ex = ch.cart.find((c) => c.productId === productId);
    if (!ex) return;
    if (qty <= 0) ch.cart = ch.cart.filter((c) => c.productId !== productId);
    else ex.qty = qty;
    emit();
  },
  clear(type: OrderType) {
    state[type].cart = [];
    emit();
  },
  setAddress(type: OrderType, a: Address) {
    state[type].address = a;
    emit();
  },
  setPayment(type: OrderType, p: PaymentMethod) {
    state[type].payment = p;
    emit();
  },
  placeOrder(type: OrderType): Order {
    const ch = state[type];
    const items = ch.cart.map((c) => {
      const p = products.find((x) => x.id === c.productId)!;
      return {
        productId: p.id,
        name: p.name,
        qty: c.qty,
        price: p.price,
        bv: p.bv,
      };
    });
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const gst = Math.round(subtotal * 0.18);
    const shipping = subtotal >= 5000 ? 0 : 99;
    const bvTotal = items.reduce((s, i) => s + i.bv * i.qty, 0);
    const total = subtotal + gst + shipping;
    const order: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 899999)}`,
      type,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      items,
      subtotal,
      gst,
      shipping,
      total,
      bvTotal,
      payment: ch.payment,
      address: { ...ch.address },
      status: "Confirmed",
    };
    state.orders = [order, ...state.orders];
    ch.cart = [];
    emit();
    return order;
  },
};

export function useCart() {
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.get,
    cartStore.get,
  );
}

export function cartTotals(cart: CartItem[], products: any[] = []) {
  const items = cart.map((c) => {
    const p = products.find((x) => x.id === c.productId)!;
    return {
      ...p,
      qty: c?.qty || 0,
      lineTotal: p?.price * c?.qty,
      lineBV: p?.bv * c?.qty,
    };
  });
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const gst = Math.round(subtotal * 0.18);
  const shipping = subtotal === 0 ? 0 : subtotal >= 5000 ? 0 : 99;
  const bvTotal = items.reduce((s, i) => s + i.lineBV, 0);
  const total = subtotal + gst + shipping;
  return { items, subtotal, gst, shipping, bvTotal, total };
}
