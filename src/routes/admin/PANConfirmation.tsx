import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IdCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PANConfirmation = () => {
  const [checkLists, setCheckLists] = useState<string[]>([]);
  

  const { data, isLoading } = useQuery({
    queryKey: ["pan"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/pan");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/admin/pan/verify", checkLists);
      return res.data;
    },
    onSuccess: () => {
      toast.success("PAN Verified Successfully");
      setCheckLists([]);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleCheck = (id: string) => {
    if (checkLists.includes(id)) {
      setCheckLists(checkLists.filter((item: string) => item !== id));
    } else {
      setCheckLists([...checkLists, id]);
    }
  };

  const handleVerification = () => {
    if (checkLists.length === 0) {
      toast.error("Select at least one PAN to verify");
      return;
    }

    mutation.mutate();
  };

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <main>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          PAN Records ({data?.length})
        </h2>
        <Button
          onClick={handleVerification}
          className="h-11 w-1/8 rounded-2xl bg-linear-to-r from-yellow-400 to-yellow-600 font-semibold text-black"
        >
          {mutation.isPending ? <Loader2 className="animate-spin" /> : "Verify"}
        </Button>
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
                  #
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Sr.
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  DOJ
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Member
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  PAN No.
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {data?.map((user: any, index: number) => (
                <tr key={index} className="transition hover:bg-white/3">
                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                    <Input
                      type="checkbox"
                      className="h-4 w-4"
                      onChange={() => handleCheck(user?.MemberID)}
                    />
                  </td>

                  <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                    {index + 1}
                  </td>
                  {/* DATE */}

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {new Date(user.ModifyDate).toLocaleDateString()}
                  </td>

                  {/* MEMBER ID */}

                  <td className="px-6 py-5 text-sm font-medium text-yellow-400">
                    {user.MemberID || "-"}
                  </td>

                  {/* MEMBER */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="text-white font-medium">
                        {user.MemberName || "-"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.PAN || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && data?.length === 0 && (
          <div className="py-20 text-center">
            <IdCard className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

            <h3 className="text-xl font-semibold text-white">
              No PAN Records Found
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

export default PANConfirmation;
