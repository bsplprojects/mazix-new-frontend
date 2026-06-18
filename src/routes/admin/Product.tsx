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
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Package2, Pencil, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const Product = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState({
    pID: 0,
    pCatID: 0,
    Status: "",
    Product: "",
    Description: "",
    MRP: 0,
    MemberMRP: 0,
    StockistMRP: 0,
    GST: 0,
    Discount: 0,
    BV: 0,
    Repurchase: 0,
    seqOnline: 0,
  });

  const client = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/products");
      return res.data;
    },
  });

  const filteredProducts = useMemo(() => {
    return products?.filter((product: any) => {
      return product?.Product?.toLowerCase().includes(search.toLowerCase());
    });
  }, [products, search]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/categories");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/admin/product/new`, data);
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added successfully");
      setData({
        pID: 0,
        pCatID: 0,
        Status: "",
        Product: "",
        Description: "",
        MRP: 0,
        MemberMRP: 0,
        StockistMRP: 0,
        GST: 0,
        Discount: 0,
        BV: 0,
        Repurchase: 0,
        seqOnline: 0,
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const numericFields = [
      "MRP",
      "MemberMRP",
      "StockistMRP",
      "GST",
      "BV",
      "Discount",
    ];

    setData({
      ...data,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    if (!data.Product) {
      toast.error("Please enter product name");
      return;
    }

    mutation.mutate();
  };
  // ----------------------------------------

  const delMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(`/admin/product/${id}`);
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleDelete = (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirm) return;

    delMutation.mutate(Number(id));
  };

  // --------------------------------------------------

  const handleEdit = (product: any) => {
    setData({
      pID: product.pID,
      pCatID: product.pCatID,
      Status: product.Status,
      Product: product.Product,
      Description: product.Description,
      MRP: product.MRP,
      MemberMRP: product.MemberMRP,
      StockistMRP: product.StockistMRP,
      GST: product.GST,
      Discount: product.Discount,
      BV: product.BV,
      Repurchase: product.Repurchase,
      seqOnline: product.seqOnline,
    });

    window.scrollTo(0, 0);
  };

  return (
    <main>
      <h2 className="text-2xl font-bold tracking-tight text-white">
        Add Product
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-5 ">
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Product
          </Label>
          <Input
            value={data.Product}
            name="Product"
            onChange={handleChange}
            placeholder="Product"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Category
          </Label>
          <Select
            value={data.pCatID}
            onValueChange={(e: string) =>
              setData({ ...data, pCatID: Number(e) })
            }
          >
            <SelectTrigger className="w-full mt-1 ">
              <SelectValue placeholder="Select Cateogory" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((c: any) => (
                <SelectItem key={c.pCatID} value={c.pCatID}>
                  {c.Category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            MRP
          </Label>
          <Input
            value={data.MRP}
            name="MRP"
            onChange={handleChange}
            onFocus={(e) => e.target.select()}
            type="number"
            placeholder="100"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Member MRP
          </Label>
          <Input
            value={data.MemberMRP}
            name="MemberMRP"
            onChange={handleChange}
            onFocus={(e) => e.target.select()}
            type="number"
            placeholder="100"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Stockist MRP
          </Label>
          <Input
            value={data.StockistMRP}
            name="StockistMRP"
            onChange={handleChange}
            onFocus={(e) => e.target.select()}
            type="number"
            placeholder="100"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            GST (%)
          </Label>
          <Input
            name="GST"
            value={data.GST}
            onChange={handleChange}
            onFocus={(e) => e.target.select()}
            type="number"
            placeholder="5"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            BV
          </Label>
          <Input
            value={data.BV}
            name="BV"
            onChange={handleChange}
            onFocus={(e) => e.target.select()}
            type="number"
            placeholder="5"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Discount (%)
          </Label>
          <Input
            value={data.Discount}
            name="Discount"
            onChange={handleChange}
            onFocus={(e) => e.target.select()}
            type="number"
            placeholder="10"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Repurchase
          </Label>
          <Select
            value={data.Repurchase}
            onValueChange={(e: string) =>
              setData({ ...data, Repurchase: Number(e) })
            }
          >
            <SelectTrigger className="w-full mt-1 ">
              <SelectValue placeholder="Select Repurchase Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"1"}>Yes</SelectItem>
              <SelectItem value={"0"}>No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Status
          </Label>
          <Select
            value={data.Status}
            onValueChange={(e: string) => setData({ ...data, Status: e })}
          >
            <SelectTrigger className="w-full mt-1 ">
              <SelectValue placeholder="Select Pay Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="deactive">Deactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Description
          </Label>
          <Textarea
            value={data.Description}
            name="Description"
            onChange={handleChange}
            placeholder="Product description"
            className="mt-1 "
          />
        </div>
      </div>
      <div className="mt-5">
        <Button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="h-11 flex-1 rounded-2xl bg-linear-to-r from-yellow-400 to-yellow-600 font-semibold text-black w-1/6"
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
      </div>

      <div className="flex items-center justify-between mt-10">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Product List ({products?.length})
        </h2>
        <Input
          placeholder="Search"
          className="w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto mt-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
          </div>
        ) : (
          <table className="w-full min-w-250">
            <thead className="border-b border-white/10 bg-white/3">
              <tr className="text-left">
                {/* TABLE HEADER */}
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Sr.
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Category
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Item
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Description
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  MRP
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Member MRP
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Stockist MRP
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  GST (%)
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Type
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  BV
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Dis (%)
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Image
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredProducts?.map((user: any, index: number) => (
                <tr key={index} className="transition hover:bg-white/3">
                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                    {index + 1}
                  </td>
                  {/* DATE */}

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.Joining}
                  </td>

                  {/* MEMBER ID */}

                  <td className="px-6 py-5 text-sm font-medium text-yellow-400 text-nowrap">
                    {user.Product || "-"}
                  </td>

                  {/* MEMBER */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="text-white font-medium line-clamp-2">
                        {user.Description || "-"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.MRP || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.MemberMRP || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.StockistMRP || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300 min-w-62.5">
                    {user.GST || "0"}%
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.Repurchase || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.BV || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.Discount || "0"}%
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.Status || ""}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    <img
                      src={`https://new.mazix.co.in/${user?.Image?.replace("../../", "")}`}
                      alt="image"
                      width={50}
                    />
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300 flex items-center gap-1">
                    <Button
                      onClick={() => handleEdit(user)}
                      size={"icon"}
                      variant={"outline"}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(user?.pID)}
                      size={"icon"}
                      variant={"destructive"}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && products?.length === 0 && (
          <div className="py-20 text-center">
            <Package2 className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

            <h3 className="text-xl font-semibold text-white">
              No Products Found
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Try searching with another keyword or dates.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Product;
