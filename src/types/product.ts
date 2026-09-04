export interface Product {
  BV: number;
  CartImage: string;
  Category: string;
  Description: string;
  Details: string | null;
  Discount: number;
  GST: number;
  Image: string;
  MRP: number;
  MemberMRP: number;
  Product: string;
  Repurchase: string;
  Status: string;
  StockistMRP: number;
  pCatID: number;
  pID: number;
  reviews?: string;
}

export interface CartItem {
  id: number;
  image: string;
  mrp: number;
  quantity: number;
  name: string;
  price: number;
  weight: number;
}
