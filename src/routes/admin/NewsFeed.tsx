import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const NewsFeed = () => {
  const [data, setData] = useState({
    News: "",
    For: "",
  });
  const client = useQueryClient();

  const { data: packages } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/news-feed");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/admin/news/new`, {
        NewsAnnounce1: data.News,
        DisplayFor: data.For,
      });
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["news"] });
      toast.success("News published successfully");
      setData({
        News: "",
        For: "",
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

  const handleSubmit = () => {
    mutation.mutate();
  };

  const handleDelete = (id: number) => {
    if (!id) return;

    if (window.confirm("Are you sure you want to delete this news?") === false)
      return;

    axiosInstance
      .delete(`/admin/news/${id}`)
      .then(() => {
        client.invalidateQueries({ queryKey: ["news"] });
        toast.success("News deleted successfully");
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  return (
    <main>
      <h2 className="text-2xl font-bold tracking-tight text-white">
        News Feed
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 ">
        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            News
          </Label>
          <Input
            className="mt-1"
            value={data.News}
            placeholder="Enter message"
            onChange={(e) => setData({ ...data, News: e.target.value })}
          />
        </div>

        <div>
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            News For
          </Label>
          <Input
            placeholder="All or 12345"
            className="mt-1"
            value={data.For}
            onChange={(e) => setData({ ...data, For: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Button
          onClick={handleSubmit}
          className="flex-1 rounded-2xl bg-linear-to-r from-yellow-400 to-yellow-600 font-semibold text-black mt-4 w-1/6"
        >
          Save
        </Button>
      </div>

      {/* table */}
      <div className="mt-5">
        <table className="w-full min-w-250">
          <thead className="border-b border-white/10 bg-white/3">
            <tr className="text-left">
              <th
                scope="col"
                className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                News
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                For
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {packages?.data?.map((p: any) => (
              <tr key={p?.NewsID} className="transition hover:bg-white/3">
                <td
                  scope="row"
                  className="px-6 py-5 text-sm font-semibold text-zinc-300"
                >
                  {p?.NewsAnnounce}
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                  {p?.DisplayFor}
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                  {p?.ModifyDate?.split("T")[0] || "-"}
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                  <Button
                    onClick={() => handleDelete(p?.NewsID)}
                    variant="destructive"
                    size={"icon-xs"}
                  >
                    <Trash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {packages?.length === 0 && (
          <div className="py-20 text-center">
            <Users className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

            <h3 className="text-xl font-semibold text-white">
              No News Published yet
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

export default NewsFeed;
