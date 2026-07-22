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
import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Package2, Pencil, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const Category = () => {
  const [search, setSearch] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [data, setData] = useState({
    pCatID: 0,
    Status: "",
    Category: "",
    seqOnline: "",
    image: "",
  });

  const client = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/categories");
      return res.data;
    },
  });

  const filteredCategories = useMemo(() => {
    return categories?.filter((category: any) => {
      return category?.Category?.toLowerCase().includes(search.toLowerCase());
    });
  }, [categories, search]);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axiosInstance.post(`/admin/category/new`, formData);
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["categories"] });
      toast.success(
        data?.pCatID > 0
          ? "Category updated successfully"
          : "Category added successfully",
      );
      setData({
        pCatID: 0,
        Status: "",
        Category: "",
        seqOnline: "",
        image: "",
      });
      setFile(null);
      setPreview(null);
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
    const numericFields = ["seqOnline"];

    setData({
      ...data,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    if (!data.Category) {
      toast.error("Please enter product name");
      return;
    }

    const formData = new FormData();

    formData.append("pCatID", data.pCatID.toString());
    formData.append("Status", data.Status);
    formData.append("Category", data.Category);
    formData.append("seqOnline", data.seqOnline.toString());
    formData.append("Image", data.image || "");

    if (file) {
      formData.append("Image", file);
    }

    mutation.mutate(formData);
  };

  // ----------------------------------------

  const delMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(`/admin/category/${id}`);
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
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
      "Are you sure you want to delete this category?",
    );
    if (!confirm) return;

    delMutation.mutate(Number(id));
  };

  // --------------------------------------------------

  const handleEdit = (product: any) => {
    setData({
      pCatID: product.pCatID,
      Status: product.Status,
      Category: product.Category,
      seqOnline: product.seqOnline,
      image: product.Image,
    });
    setPreview(
      `https://app.mymazix.com/${product?.Image?.replace("../../", "")}`,
    );
    window.scrollTo(0, 0);
  };

  return (
    <main>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Add Category
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-5 ">
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
            Category
          </Label>
          <Input
            value={data.Category}
            name="Category"
            onChange={handleChange}
            placeholder="Category"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
            Status
          </Label>
          <Select
            value={data.Status}
            onValueChange={(e: string) => setData({ ...data, Status: e })}
          >
            <SelectTrigger className="w-full mt-1 ">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Deactive">Deactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
            Sequence
          </Label>
          <Input
            value={data.seqOnline}
            name="seqOnline"
            onChange={handleChange}
            placeholder="Sequence"
            className="mt-1 "
          />
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
            Image
          </Label>
          <Input
            type="file"
            accept="image/*"
            className="mt-1"
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
        </div>
        {preview && (
          <div className="col-span-2 mt-3">
            <Label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
              Image Preview
            </Label>
            {<img src={preview} className="mt-1 w-20 h-20" />}
          </div>
        )}
      </div>
      <div className="mt-5">
        <Button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className=" w-1/9"
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
      </div>

      <div className="flex items-center justify-between mt-10">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Categories List ({categories?.length})
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
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full min-w-250">
            <thead className="border-b border-border bg-muted/40 text-nowrap">
              <tr className="text-left">
                {/* TABLE HEADER */}
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Sr.
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Category
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Image
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Sequence
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredCategories?.map((user: any, index: number) => (
                <tr key={index} className="transition hover:bg-white/3">
                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-accent-foreground">
                    {index + 1}
                  </td>
                  {/* DATE */}

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Category}
                  </td>

                  {/* MEMBER ID */}

                  <td className="px-6 py-5 text-sm font-medium text-primary text-nowrap">
                    <img
                      src={`https://app.mymazix.com/${user?.Image?.replace("../../", "")}`}
                      alt="img"
                      width={50}
                    />
                  </td>

                  {/* MEMBER */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="text-primary font-medium line-clamp-2">
                        {user.Status || "-"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.seqOnline || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {new Date(user.ModifyDate).toLocaleDateString() || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground flex items-center gap-1">
                    <Button
                      onClick={() => handleEdit(user)}
                      size={"icon"}
                      variant={"outline"}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(user?.pCatID)}
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

        {!isLoading && categories?.length === 0 && (
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

export default Category;
