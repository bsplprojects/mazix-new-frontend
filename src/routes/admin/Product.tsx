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
import { Images, Loader2, Package2, Pencil, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDebounce } from "use-debounce";
import { Separator } from "@/components/ui/separator";

const PAGE_SIZE = 10;

const Product = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [page, setPage] = useState(1);
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
    Image: "",
    stock: 0,
  });

  const client = useQueryClient();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", page, debouncedSearch],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/products", {
        params: {
          page,
          pageSize: PAGE_SIZE,
          search: debouncedSearch,
        },
      });
      return res.data;
    },
  });

  const products = productsData?.list;
  const pagination = productsData?.pagination;

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
    mutationFn: async (formData: FormData) => {
      const res = await axiosInstance.post(`/admin/product/new`, formData);
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["products"] });
      toast.success(
        data.pID
          ? "Product updated successfully"
          : "Product added successfully",
      );
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
        Image: "",
        stock: 0,
      });
      setFile(null);
      setPreview(null);
      setSearch("");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const numericFields = [
      "MRP",
      "MemberMRP",
      "StockistMRP",
      "GST",
      "BV",
      "Discount",
      "stock",
    ];

    setData({
      ...data,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    if (!data?.Product?.trim()) {
      toast.error("Please enter product name");
      return;
    }

    const formData = new FormData();

    const appendValue = (key: string, value: any) => {
      if (value === null || value === undefined) {
        formData.append(key, "");
        return;
      }

      formData.append(key, String(value));
    };

    appendValue("pID", Number(data?.pID) || 0);
    appendValue("Product", data?.Product?.trim() || "");
    appendValue("pCatID", Number(data?.pCatID) || 0);
    appendValue("Description", data?.Description || "");

    appendValue("MRP", Number(data?.MRP) || 0);
    appendValue("MemberMRP", Number(data?.MemberMRP) || 0);
    appendValue("StockistMRP", Number(data?.StockistMRP) || 0);

    appendValue("GST", Number(data?.GST) || 0);
    appendValue("Discount", Number(data?.Discount) || 0);
    appendValue("BV", Number(data?.BV) || 0);

    appendValue("Repurchase", Number(data?.Repurchase));
    appendValue("seqOnline", Number(data?.seqOnline) || 0);

    appendValue("Status", data?.Status || "Active");

    appendValue("stock", Number(data?.stock) || 0);

    if (!file && data?.Image) {
      appendValue("Image", data.Image);
    }

    if (file instanceof File) {
      formData.append("Image", file);
    }

    mutation.mutate(formData);
  };

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
    setFile(null);
    if (!confirm) return;

    delMutation.mutate(Number(id));
  };

  const handleEdit = (product: any = {}) => {
    setFile(null);

    setData({
      pID: Number(product?.pID) || 0,
      pCatID: Number(product?.pCatID) || 0,

      Status: product?.Status ?? "Active",

      Product: product?.Product ?? "",

      Description: product?.Description ?? "",

      MRP: Number(product?.MRP) || 0,
      MemberMRP: Number(product?.MemberMRP) || 0,
      StockistMRP: Number(product?.StockistMRP) || 0,
      GST: Number(product?.GST) || 0,
      Discount: Number(product?.Discount) || 0,
      BV: Number(product?.BV) || 0,

      Repurchase: Number(product?.Repurchase ?? 0),

      seqOnline: Number(product?.seqOnline) || 0,

      Image: product?.Image ?? "",

      stock: Number(product?.stock) || 0,
    });

    if (product?.Image) {
      setPreview(
        `https://app.mymazix.com/${String(product.Image).replace("../../", "")}`,
      );
    } else {
      setPreview("");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
            Stock
          </Label>
          <Input
            value={data.stock}
            name="stock"
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
            value={String(data.Repurchase)}
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
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Deactive">Deactive</SelectItem>
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

        <div className="col-span-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Image
          </Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFile(file);
              }
              const reader = new FileReader();
              reader.onload = () => {
                setPreview(reader.result as string);
              };
              reader.readAsDataURL(file!);
            }}
          />
          {preview && (
            <div className="col-span-2 mt-3">
              <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Image Preview
              </Label>
              {<img src={preview} className="mt-1 w-20 h-20" />}
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <Button
          onClick={() => {
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
              Image: "",
              stock: 0,
            });
            setFile(null);
            setPreview(null);
          }}
          variant={"outline"}
          className="w-1/9"
        >
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="w-1/9"
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
      </div>

      <Separator className="my-10" />

      <div className="flex items-center justify-between mt-10">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Product List ({pagination?.total})
        </h2>
        <Input
          placeholder="Search by Product Name"
          className="w-1/3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
      <div className="overflow-x-auto mt-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
          </div>
        ) : (
          <table className="w-full min-w-250">
            <thead className="border-b border-white/10 bg-white/3 text-nowrap">
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
                  Repurchase
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

            <tbody className="divide-y divide-white/10 text-sm">
              {filteredProducts?.length > 0 ? (
                filteredProducts?.map((user: any, index: number) => (
                  <tr
                    key={index}
                    className="transition hover:bg-white/3 text-xs"
                  >
                    {/* SR NO */}
                    <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                      {index + 1}
                    </td>
                    {/* DATE */}
                    <td className="px-6 py-5 text-xs text-zinc-300">
                      {user.Joining}
                    </td>

                    {/* MEMBER ID */}

                    <td className="px-6 py-5 text-xs font-medium text-yellow-400 text-nowrap">
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
                      {user.Repurchase === "1" ? "Yes" : "No"}
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
                      {user?.Image === null ? (
                        <div className="h-12 w-12 border flex items-center justify-center">
                          <Images className="text-primary/60" />
                        </div>
                      ) : (
                        <img
                          loading="lazy"
                          onClick={() =>
                            window.open(
                              `https://app.mymazix.com/${user?.Image?.replace("../../", "")}`,
                            )
                          }
                          src={`https://app.mymazix.com/${user?.Image?.replace("../../", "")}`}
                          alt={user?.name}
                          width={50}
                        />
                      )}
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
                ))
              ) : (
                <tr>
                  <td colSpan={15} className="text-center py-10">
                    No Products Found
                  </td>
                </tr>
              )}
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

      <Pagination className="mt-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className={`${page === 1 ? "pointer-events-none opacity-50" : ""} `}
            />
          </PaginationItem>

          {Array.from({ length: pagination?.totalPages || 1 }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={page === i + 1}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              className={`${page === pagination?.totalPages ? "pointer-events-none opacity-50" : ""} `}
              onClick={() =>
                setPage((p) => Math.min(p + 1, pagination?.totalPages || 1))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
};

export default Product;
