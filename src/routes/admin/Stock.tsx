import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Plus, Printer, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type rowItem = {
  name: string;
  pID: string;
  pCatID?: string;
  MRP: number;
  MemberMRP: number;
  GST: number;
  Discount: number;
  Stock: number;
  Qty: number;
  Amount: number;
  TaxableAmount: number;
  GSTAmount: number;
  discountAmount: number;
};

const Stock = () => {
  const [memberId, setMemberId] = useState("");
  const [debouncedMemberId, setDebouncedMemberId] = useState("");
  const [pCatID, setPCatID] = useState("");
  const [itemId, setItemId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [payMode, setPayMode] = useState("");
  const [payDetails, setPayDetails] = useState("");

  const [paidAmount, setPaidAmount] = useState(0);
  const [qty, setQty] = useState(0);
  const [rowItems, setRowItems] = useState<rowItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMemberId(memberId);
    }, 300);

    return () => clearTimeout(timer);
  }, [memberId]);

  const { isLoading } = useQuery({
    queryKey: ["member", debouncedMemberId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/member/${debouncedMemberId}`);
      setName(res.data?.data?.MemberName);
      setPhone(res.data?.data?.ContactNo);
      setEmail(res.data?.data?.EmailID);
      return res.data?.data;
    },
    enabled: !!debouncedMemberId,
  });

  // fetch categories
  const { data: categories, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/categories");
      return res.data;
    },
  });

  // fetch products
  const { data: products } = useQuery({
    queryKey: ["products", pCatID],
    queryFn: async () => {
      const res = await axiosInstance.get(`/joining/products/${pCatID}`);
      return res.data;
    },
    enabled: !!pCatID,
  });

  // fetch product with stock
  const { data: product } = useQuery({
    queryKey: ["product", itemId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/joining/product/${itemId}`);
      return res.data;
    },
    enabled: !!itemId,
  });

  // add product to row items for calculations
  const handleAddProduct = (item: any) => {
    const memberMRP = Number(item?.MemberMRP ?? 0);
    const qtyValue = Number(qty ?? 0);
    const discount = Number(item?.Discount ?? 0);
    const gst = Number(item?.GST ?? 0);

    const baseAmount = memberMRP * qtyValue;

    // Discount
    const discountAmount = (baseAmount * discount) / 100;
    const finalAmount = baseAmount - discountAmount;

    // GST
    const taxableAmount = finalAmount / (1 + gst / 100);
    const gstAmount = finalAmount - taxableAmount;

    const payload: rowItem = {
      name: item?.Product ?? "",
      pID: item?.pID ?? 0,
      pCatID: item?.pCatID ?? 0,
      MRP: item?.MRP ?? 0,
      MemberMRP: memberMRP,
      GST: gst,
      Discount: discount,
      Stock: item?.productStock?.stock ?? 0,
      Qty: qtyValue,
      Amount: Number(finalAmount.toFixed(2)),
      TaxableAmount: Number(taxableAmount.toFixed(2)),
      GSTAmount: Number(gstAmount.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
    };

    if (qty <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (qty > item?.productStock?.stock) {
      toast.error("Quantity must be less than stock");
      return;
    }

    // check for existing item in rowItems
    const existingItem = rowItems.find(
      (item: rowItem) => item.pID === payload.pID,
    );

    if (existingItem) {
      toast.error("Item already added");
      return;
    } else {
      setRowItems([...rowItems, payload]);
      setQty(0);
      setItemId("");
    }
  };

  const handleRemoveItem = (pID: string) => {
    setRowItems(rowItems.filter((item: rowItem) => item.pID !== pID));
  };

  const { totalAmount, totalTaxable, totalGst, totalDiscount } = useMemo(() => {
    return rowItems.reduce(
      (acc, item) => {
        acc.totalAmount += item.Amount || 0;
        acc.totalTaxable += item.TaxableAmount || 0;
        acc.totalGst += item.GSTAmount || 0;
        acc.totalDiscount +=
          (item.MemberMRP * item.Qty * item.Discount) / 100 || 0;

        return acc;
      },
      {
        totalAmount: 0,
        totalTaxable: 0,
        totalGst: 0,
        totalDiscount: 0,
      },
    );
  }, [rowItems]);

  useEffect(() => {
    setPaidAmount(totalAmount);
  }, [totalAmount]);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/admin/invoice/new`, {
        memberId,
        rowItems,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        paymentMode: payMode,
        paymentDetails: payDetails,
        totalAmount,
        totalTaxable,
        totalGst,
        totalDiscount,
        paidAmount,
      });
      return res.data;
    },
    onSuccess: () => {
      setRowItems([]);
      setMemberId("");
      setPCatID("");
      setItemId("");
      setName("");
      setPhone("");
      setEmail("");
      setQty(0);
      toast.success("Invoice created successfully");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.msg);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleSubmit = () => {
    if (rowItems.length === 0) {
      toast.error("Please add at least one item to the invoice");
      return;
    }
    if (!memberId) {
      toast.error("Please enter member id");
      return;
    }
    mutation.mutate();
  };

  return (
    <main>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Invoice
      </h2>
      <div>
        <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
          Manage Stocks and Invoice
        </Label>
      </div>

      {/* HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4">
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
            MEMBER ID
          </Label>
          <Input
            className="mt-1"
            placeholder="MAZ*****"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
            NAME
          </Label>
          <Input
            className="mt-1"
            placeholder="John Doe"
            disabled={isLoading}
            value={isLoading ? "Loading..." : name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
            PHONE
          </Label>
          <Input
            className="mt-1"
            placeholder="+91 6205617845"
            type="phone"
            disabled={isLoading}
            value={isLoading ? "Loading..." : phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
            EMAIL
          </Label>
          <Input
            className="mt-1"
            placeholder="johndoe@gmail.com"
            type="email"
            disabled={isLoading}
            value={isLoading ? "Loading..." : email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Item selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4">
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
            CATEGORY
          </Label>
          <Select value={pCatID} onValueChange={setPCatID}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map(
                (category: { pCatID: number; Category: string }) => (
                  <SelectItem
                    key={category.pCatID}
                    value={String(category.pCatID)}
                  >
                    {category.Category}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
            PRODUCTS
          </Label>

          <Select
            value={itemId}
            onValueChange={setItemId}
            disabled={!products || products.length === 0 || isCategoryLoading}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue
                placeholder={
                  products?.length
                    ? "Select a product"
                    : "No items found for this category"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {products?.map(
                (product: { id: number | string; name: string }) => (
                  <SelectItem key={product.id} value={String(product.id)}>
                    {product.name}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {product && <Separator className="my-4" />}

      {/* Item details */}
      {product && (
        <div className="w-full grid grid-cols-1 md:grid-cols-[auto_repeat(7,minmax(0,1fr))] gap-4 mt-5">
          <div>
            <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground mb-1">
              IMAGE
            </Label>

            <img
              onClick={() =>
                window.open(
                  `https://app.mymazix.com/${product?.data?.Image?.replace("../../", "")}`,
                )
              }
              src={`https://app.mymazix.com/${product?.data?.Image?.replace("../../", "")}`}
              alt={product?.data?.name}
              className="w-20 h-20 object-cover cursor-pointer"
            />
          </div>

          <div>
            <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground mb-1">
              MRP
            </Label>

            <Input
              className="mt-1"
              placeholder="MRP"
              disabled
              value={product?.data?.MRP ?? 0}
            />
          </div>

          <div>
            <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground mb-1">
              MEMBER MRP
            </Label>

            <Input
              className="mt-1"
              placeholder="MEMBER MRP"
              disabled
              value={product?.data?.MemberMRP ?? 0}
            />
          </div>

          <div>
            <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground mb-1">
              GST (%)
            </Label>

            <Input
              className="mt-1"
              placeholder="GST"
              disabled
              value={product?.data?.GST ?? 0}
            />
          </div>

          <div>
            <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground mb-1">
              DISCOUNT (%)
            </Label>

            <Input
              className="mt-1"
              placeholder="GST"
              disabled
              value={product?.data?.Discount ?? 0}
            />
          </div>

          <div>
            <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground mb-1">
              STOCK
            </Label>

            <Input
              className="mt-1"
              placeholder="QTY"
              disabled
              value={product?.data?.productStock?.stock ?? 0}
            />
          </div>

          <div>
            <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground mb-1">
              QTY
            </Label>

            <Input
              className="mt-1"
              placeholder="QTY"
              value={qty}
              type="number"
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>

          <div>
            <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground mb-1">
              ACTION
            </Label>

            <Button onClick={() => handleAddProduct(product?.data)} size="sm">
              <Plus /> Add
            </Button>
          </div>
        </div>
      )}

      <Separator className="my-4" />

      {/* ITEMS LIST */}
      <h4>ITEMS</h4>
      {
        <div className="my-4">
          <Table className="border table-xs ">
            <TableHeader className="border-b border-border bg-muted/40 text-nowrap">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>MRP</TableHead>
                <TableHead>MemberMRP</TableHead>
                <TableHead>Taxable</TableHead>
                <TableHead>SGST</TableHead>
                <TableHead>CGST</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rowItems.map((item: rowItem, index: number) => (
                <TableRow key={item.pID}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.MRP.toFixed(2)}</TableCell>
                  <TableCell>{item.MemberMRP.toFixed(2)}</TableCell>
                  <TableCell>{item.TaxableAmount.toFixed(2)}</TableCell>
                  <TableCell>{(item.GSTAmount / 2).toFixed(2)}</TableCell>
                  <TableCell>{(item.GSTAmount / 2).toFixed(2)}</TableCell>
                  <TableCell>{item.Discount.toFixed(2)}</TableCell>
                  <TableCell>{item.Qty.toFixed(2)}</TableCell>
                  <TableCell>{item.Amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Trash
                      className="w-4 h-4"
                      onClick={() => handleRemoveItem(item.pID)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }

      {/* FOOTER - PAY MODE & GROSS TOTALS */}
      <div className="w-full flex flex-col md:flex-row items-start justify-between my-4">
        <div>
          <div>
            <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground mb-1">
              PAYMENT MODE
            </Label>

            <Select value={payMode} onValueChange={setPayMode}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>

            {payMode === "upi" && (
              <Input
                placeholder="UPI ID"
                className="mt-4"
                value={payDetails}
                onChange={(e) => setPayDetails(e.target.value)}
              />
            )}
            {payMode === "cheque" && (
              <Input
                placeholder="CHEQUE NO"
                className="mt-4"
                value={payDetails}
                onChange={(e) => setPayDetails(e.target.value)}
              />
            )}
          </div>

          <div>
            <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground mt-4">
              REMARKS
            </Label>

            <Input placeholder="Remarks" className="mt-1" />
          </div>
        </div>

        {/* TOTAL SECTION*/}
        <div className="border">
          <Table className="border table-xs ">
            <TableHeader>
              <TableRow>
                <TableHead className="border-b border-border bg-muted/40 text-nowrap w-37.5">
                  Total Taxable
                </TableHead>
                <TableHead className="w-37.5 text-right">
                  {totalTaxable.toFixed(2)}
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="border-b border-border bg-muted/40 text-nowrap w-37.5">
                  Discount
                </TableHead>
                <TableHead className="w-37.5 text-right">
                  {totalDiscount.toFixed(2)}
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="border-b border-border bg-muted/40 text-nowrap w-37.5">GST</TableHead>
                <TableHead className="w-37.5 text-right">
                  {totalGst.toFixed(2)}
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="border-b border-border bg-muted/40 text-nowrap w-37.5">
                  Grand Total
                </TableHead>
                <TableHead className="w-37.5 text-right">
                  {totalAmount.toFixed(2)}
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="border-b border-border bg-muted/40 text-nowrap w-37.5">Paid</TableHead>
                <TableHead className="w-37.5 text-right">
                  <Input
                    placeholder="0"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>

          <div className="p-3 flex justify-end">
            <Button onClick={handleSubmit}>
              <Printer /> Generate Bill
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Stock;
