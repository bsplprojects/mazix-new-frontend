import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const Stock = () => {
  const [memberId, setMemberId] = useState("");
  const [debouncedMemberId, setDebouncedMemberId] = useState("");
  const [pCatID, setPCatID] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

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

  const { data: categories, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/categories");
      return res.data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["products", pCatID],
    queryFn: async () => {
      const res = await axiosInstance.get(`/joining/products/${pCatID}`);
      return res.data;
    },
    enabled: !!pCatID,
  });

  return (
    <main>
      <h2 className="text-2xl font-bold tracking-tight text-white">Invoice</h2>
      <div>
        <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          Manage Stocks and Invoice
        </Label>
      </div>

      {/* HEADER */}
      <div className="grid grid-col-1 md:grid-cols-4 gap-2 mt-4">
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
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
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
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
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
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
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
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
      <div className="grid grid-col-1 md:grid-cols-4 gap-2 mt-4">
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
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
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            PRODUCTS
          </Label>

          <Select
            value={pCatID}
            onValueChange={setPCatID}
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
    </main>
  );
};

export default Stock;
