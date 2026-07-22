import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 10;

const FranchiseList = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["franchises", page],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/franchise`, {
        params: {
          page,
          pageSize: PAGE_SIZE,
        },
      });
      return res.data;
    },
  });

  const reports = data?.data || [];
  const pagination = data?.pagination;

  return (
    <main className="my-5">
      <div className="flex items-center gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Franschise List
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Showing{" "}
            <span className="font-semibold text-primary">{reports.length}</span>{" "}
            results
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
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
                  Member ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Member
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Contact No.
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  Gender
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {reports?.map((user: any, index) => (
                <tr
                  key={index}
                  className="transition hover:bg-white/3 text-nowrap"
                >
                  {/* SR NO */}
                  <td className="px-6 py-5 text-sm font-semibold text-accent-foreground">
                    {index + 1}
                  </td>

                  {/* MEMBER ID */}

                  <td className="px-6 py-5 text-sm font-medium text-primary">
                    {user.MemberID || "-"}
                  </td>

                  {/* MEMBER */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="text-accent-foreground font-medium">
                        {user.MemberName || "-"}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.ContactNo || "-"}
                  </td>

                  <td className="px-6 py-5 text-sm text-accent-foreground">
                    {user.Gender || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && reports?.length === 0 && (
          <div className="py-20 text-center">
            <Users className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

            <h3 className="text-xl font-semibold text-white">
              No Franchise List Found
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Try searching with another keyword or dates.
            </p>
          </div>
        )}

        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination?.hasPrev) {
                    setPage((prev) => prev - 1);
                  }
                }}
                className={
                  !pagination?.hasPrev ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {(() => {
              const items = [];

              // First page
              items.push(
                <PaginationItem key={1}>
                  <PaginationLink
                    href="#"
                    isActive={pagination?.currentPage === 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>,
              );

              if (pagination?.currentPage > 3) {
                items.push(
                  <PaginationItem key="left-ellipsis">
                    <PaginationEllipsis />
                  </PaginationItem>,
                );
              }

              // Current page -1, current, current +1
              for (
                let i = Math.max(2, pagination?.currentPage - 1);
                i <=
                Math.min(
                  pagination?.totalPage - 1,
                  pagination?.currentPage + 1,
                );
                i++
              ) {
                items.push(
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={pagination?.currentPage === i}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i);
                      }}
                    >
                      {i}
                    </PaginationLink>
                  </PaginationItem>,
                );
              }

              // Right ellipsis
              if (pagination?.currentPage < pagination?.totalPages - 2) {
                items.push(
                  <PaginationItem key="right-ellipsis">
                    <PaginationEllipsis />
                  </PaginationItem>,
                );
              }

              // Last page
              if (pagination?.totalPage > 1) {
                items.push(
                  <PaginationItem key={pagination?.totalPage}>
                    <PaginationLink
                      href="#"
                      isActive={
                        pagination?.currentPage === pagination?.totalPage
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pagination?.totalPage);
                      }}
                    >
                      {pagination?.totalPage}
                    </PaginationLink>
                  </PaginationItem>,
                );
              }

              return items;
            })()}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination?.hasNext) {
                    setPage((prev) => prev + 1);
                  }
                }}
                className={
                  !pagination?.hasNext ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
};

export default FranchiseList;
