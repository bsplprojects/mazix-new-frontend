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
  const [data, setData] = useState({
    pCatID: 0,
    Status: "",
    Category: "",
    seqOnline: "",
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
    mutationFn: async () => {
      const res = await axiosInstance.post(`/admin/category/new`, data);
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category added successfully");
      setData({
        pCatID: 0,
        Status: "",
        Category: "",
        seqOnline: "",
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

    mutation.mutate();
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
    });

    window.scrollTo(0, 0);
  };

  return (
    <main>
      <h2 className="text-2xl font-bold tracking-tight text-white">
        Add Category
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-5 ">
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
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
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
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
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
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
                  Image
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Sequence
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredCategories?.map((user: any, index: number) => (
                <tr key={index} className="transition hover:bg-white/3">
                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                    {index + 1}
                  </td>
                  {/* DATE */}

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.Category}
                  </td>

                  {/* MEMBER ID */}

                  <td className="px-6 py-5 text-sm font-medium text-yellow-400 text-nowrap">
                    <img
                      src={`https://new.mazix.co.in/${user?.Image?.replace("../../", "")}`}
                      alt="img"
                      width={50}
                    />
                  </td>

                  {/* MEMBER */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="text-white font-medium line-clamp-2">
                        {user.Status || "-"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.seqOnline || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {new Date(user.ModifyDate).toLocaleDateString() || "-"}
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
