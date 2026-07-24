import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { axiosInstance } from "@/config/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IdCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";

const PAGE_SIZE = "10";

const PANConfirmation = () => {
  const [checkLists, setCheckLists] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["pan", page, rows, debouncedSearch],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/pan", {
        params: {
          pageSize: rows === "All" ? "All" : Number(rows),
          page,
          search: debouncedSearch,
        },
      });
      return res.data;
    },
  });

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? {};

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

  const handleAllCheck = () => {
    if (checkLists.length === records?.length) {
      setCheckLists([]);
    } else {
      setCheckLists(records?.map((item: any) => item.MemberID));
    }
  };

  const getPageNumbers = () => {
    const total = pagination?.totalPages || 1;
    const current = page;
    const delta = 2;

    const pages: (number | string)[] = [];

    pages.push(1);

    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    if (left > 2) pages.push("...");

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < total - 1) pages.push("...");

    if (total > 1) pages.push(total);

    return pages;
  };

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <main>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          PAN Records ({pagination?.total})
        </h2>
        <div className="flex gap-2 ">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
          />
          <Select value={rows} onValueChange={setRows}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Select Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="All">All</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleVerification} className="w-fit">
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto mt-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full min-w-250 ">
            <thead className="border-b border-border bg-muted/40 text-nowrap">
              <tr className="text-left">
                {/* TABLE HEADER */}
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  <Checkbox onCheckedChange={handleAllCheck} />
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Sr.
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  DOJ
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Member
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  PAN No.
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {records?.map((user: any, index: number) => (
                <tr key={index} className="transition hover:bg-white/3 ">
                  {/* SR NO */}
                  <td className="px-6 py-5 text-xs font-semibold text-accent-foreground">
                    <Checkbox
                      checked={checkLists.includes(user?.MemberID)}
                      onCheckedChange={() => handleCheck(user?.MemberID)}
                    />
                  </td>

                  <td className="px-6 py-5 text-xs font-semibold text-accent-foreground">
                    {index + 1}
                  </td>
                  {/* DATE */}

                  <td className="px-6 py-5 text-xs text-accent-foreground">
                    {new Date(user.ModifyDate).toLocaleDateString()}
                  </td>

                  {/* MEMBER ID */}

                  <td className="px-6 py-5 text-xs font-medium text-primary">
                    {user.MemberID || "-"}
                  </td>

                  {/* MEMBER */}

                  <td className="px-6 py-5 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="text-primary font-medium">
                        {user.MemberName || "-"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-xs text-accent-foreground">
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

        <div className="py-2">
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getPageNumbers().map((item, index) => (
                <PaginationItem key={index}>
                  {item === "..." ? (
                    <span className="px-3 text-muted-foreground">...</span>
                  ) : (
                    <PaginationLink
                      isActive={page === item}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(item as number);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < pagination?.totalPages) setPage(page + 1);
                  }}
                  className={
                    page === pagination?.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
};

export default PANConfirmation;
