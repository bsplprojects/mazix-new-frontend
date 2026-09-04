export interface OrderDTO {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  memberId: string;
  fullName: string;
  address:string;
  city:string;
  state:string;
  pincode:string;
  phone:string;
  email:string;
  items: never;
  totalPrice: never;
  discount: number;
  appliedCoupon: null;
  shippingCost: number;
  finalTotal: number;
  shippingInfo: {
    memberId: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  orderDate: string;
}
