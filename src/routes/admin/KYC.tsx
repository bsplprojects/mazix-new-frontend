import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
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
import { Loader2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";

const PAGE_SIZE = 10;

const KYC = () => {
  const client = useQueryClient();
  const [memberId, setMemberId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["kycs", memberId, status, page],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/reports/kyc-list", {
        params: {
          MemberID: memberId,
          Status: status,
          page,
          pageSize: PAGE_SIZE,
        },
      });
      return data;
    },
    enabled: false,
  });
  const reports = data || [];

  const mutation = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await axiosInstance.post(`/admin/verify/${memberId}`);
      return res.data;
    },
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["kycs", memberId, status, page] });
      setMemberId("");
      setStatus("");
      toast.success(data?.message);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const handleVerification = (memberId: string) => {
    if (!memberId) return;
    mutation.mutate(memberId);
  };

  const getDocURL = (doc: string) => {
    return `https://app.mymazix.com/${doc?.replace("../../", "")}`;
  };

  return (
    <main>
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                KYC Verification
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Showing{" "}
                <span className="font-semibold text-yellow-400">
                  {reports.length}
                </span>{" "}
                registered members
              </p>
            </div>
          </div>
        </div>

        <div className=" bg-white/2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {/* MEMBER ID */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Member ID
              </label>

              <div className="relative">
                <Input
                  placeholder="RMG1001"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Status
              </label>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Verify">Verified</SelectItem>
                  <SelectItem value="Not Verified">Not verified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* BUTTONS */}
            <div className="flex items-end gap-2">
              <Button
                onClick={() => {
                  setPage(1);
                  refetch();
                }}
                disabled={isFetching}
              >
                {isFetching ? "Loading..." : "Search"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SALES LIST */}
      <div className="overflow-x-auto">
        {isFetching ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
          </div>
        ) : (
          <table className="w-full min-w-250">
            <thead className="border-b border-white/10 bg-white/3 text-xs">
              <tr className="text-left">
                {/* TABLE HEADER */}

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Sr.
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Name
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Photo
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  PAN
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Aadhar
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Passbook
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {reports?.map((user: any, index: number) => (
                <tr key={index} className="transition hover:bg-white/3 text-xs">
                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                    {index + 1}
                  </td>

                  {/* MEMBER ID */}

                  <td className="px-6 py-5 text-sm font-medium text-yellow-400">
                    {user.KYCMemberID || "-"}
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
                    <img
                      onClick={() =>
                        window.open(
                          `https://app.mymazix.com/${user?.PHOTO?.replace("../../", "")}`,
                        )
                      }
                      src={getDocURL(user?.PHOTO)}
                      alt="photo"
                      width={40}
                    />
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    <img
                      onClick={() =>
                        window.open(
                          `https://app.mymazix.com/${user?.PAN?.replace("../../", "")}`,
                        )
                      }
                      src={getDocURL(user?.PAN)}
                      alt="PAN"
                      width={40}
                    />
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    <img
                      onClick={() =>
                        window.open(
                          `https://app.mymazix.com/${user?.AADHAR?.replace("../../", "")}`,
                        )
                      }
                      src={getDocURL(user?.AADHAR)}
                      alt="AADHAR"
                      width={40}
                    />
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300 min-w-62.5">
                    <img
                      onClick={() =>
                        window.open(
                          `https://app.mymazix.com/${user?.PASSBOOK?.replace("../../", "")}`,
                        )
                      }
                      src={getDocURL(user?.PASSBOOK)}
                      alt="PASSBOOK"
                      width={40}
                    />
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    {user.KYCStatus || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-zinc-300">
                    <Button
                      disabled={
                        mutation.isPending ||
                        user.KYCStatus?.toLowerCase() === "verify"
                      }
                      onClick={() => handleVerification(user.KYCMemberID)}
                      size={"sm"}
                    >
                      Verify
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isFetching && reports?.length === 0 && (
          <div className="py-20 text-center">
            <Users className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

            <h3 className="text-xl font-semibold text-white">
              No Records Found
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Try searching with another keyword or dates.
            </p>
          </div>
        )}

        {/* <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
      </div>
    </main>
  );
};

export default KYC;
