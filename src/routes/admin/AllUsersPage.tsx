import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  Eye,
  ShieldCheck,
  Download,
  Loader2,
  RefreshCw,
  Edit,
  KeyRound,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getAllUsers } from "@/services/users.Api";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function AllUsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [memberId, setMemberId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await getAllUsers(memberId, fromDate, toDate, page, 10);
      setUsers(data);
      return data;
    },
    enabled: false,
  });

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u: any) =>
        u.MemberName?.toLowerCase().includes(search.toLowerCase()) ||
        u.MID?.toLowerCase().includes(search.toLowerCase()) ||
        u.MobileNo?.includes(search),
    );
  }, [search, users]);

  useEffect(() => {
    if (page > 1) {
      refetch();
    }
  }, [page]);

  const navigate = useNavigate();

  const handleEdit = (user: any) => {
    navigate(`/admin/edit-user/${user.MID}`);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 lg:p-8">
        <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[4px] text-primary">
              <ShieldCheck className="h-4 w-4" />
              Admin Dashboard
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              All Members
            </h1>

            <p className="mt-2 text-sm text-accent-foreground">
              Manage all registered users, accounts & activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="border-border bg-card/70 text-foreground hover:bg-accent"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            {/* <Button className="bg-linear-to-r from-yellow-400 to-yellow-600 text-black hover:opacity-90 h-11 px-5 rounded-xl font-semibold">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button> */}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3 backdrop-blur-xl">
        {/* TOP BAR */}

        <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-col lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/50 text-white shadow-lg">
                <Users className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Member List
                </h2>

                <p className="mt-1 text-sm text-accent-foreground">
                  Showing{" "}
                  <span className="font-semibold text-primary">
                    {filteredUsers.length}
                  </span>{" "}
                  registered members
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-white/10 bg-white/2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5 p-5">
              {/* MEMBER ID */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                  Member ID
                </label>

                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />

                  <Input
                    placeholder="RMG1001"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className=" rounded-2xl border border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-primary"
                  />
                </div>
              </div>

              {/* FROM DATE */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                  From Date
                </label>

                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className=" rounded-2xl border border-border bg-card text-foreground focus:border-primary focus-visible:ring-primary"
                />
              </div>

              {/* TO DATE */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                  To Date
                </label>

                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className=" rounded-2xl border border-border bg-card text-foreground focus:border-primary focus-visible:ring-primary"
                />
              </div>

              {/* SEARCH */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-accent-foreground">
                  Search
                </label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />

                  <Input
                    placeholder="Name / Mobile"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-2xl border border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-primary"
                  />
                </div>
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

                <Button
                  variant="outline"
                  onClick={() => {
                    setMemberId("");
                    setFromDate("");
                    setToDate("");
                    setSearch("");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full min-w-250">
              <thead className="border-b border-white/10 bg-white/3">
                <tr className="text-left text-nowrap">
                  {/* TABLE HEADER */}
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Sr.
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Member ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Member
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Guardian Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Gender
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Age
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Address
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    District
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    State
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    PinCode
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Country
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Contact No
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Email ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Aadhar No
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    PAN
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user: any, index) => (
                  <tr
                    key={index}
                    className="transition hover:bg-white/3 text-nowrap"
                  >
                    {/* SR NO */}
                    <td className="px-6 py-5 text-sm font-semibold text-accent-foreground">
                      {index + 1}
                    </td>
                    {/* DATE */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {new Date(user.ModifyDate).toLocaleString("en-IN")}
                    </td>

                    {/* MEMBER ID */}

                    <td className="px-6 py-5 text-sm font-medium text-primary">
                      {user.MemberID || user.MID || "-"}
                    </td>

                    {/* MEMBER */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="text-accent-foreground font-medium">
                          {user.MemberName || "-"}
                        </div>
                      </div>
                    </td>

                    {/* GUARDIAN NAME */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.GuardianName || "-"}
                    </td>

                    {/* GENDER */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.Gender || "-"}
                    </td>

                    {/* AGE */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.Age || "-"}
                    </td>

                    {/* ADDRESS */}

                    <td className="px-6 py-5 text-sm text-accent-foreground min-w-62.5">
                      {user.Address || "-"}
                    </td>

                    {/* DISTRICT */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.District || "-"}
                    </td>

                    {/* STATE */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.State || "-"}
                    </td>

                    {/* PINCODE */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.PinCode || "-"}
                    </td>

                    {/* COUNTRY */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.Country || "-"}
                    </td>

                    {/* CONTACT */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.ContactNo || user.MobileNo || "-"}
                    </td>

                    {/* EMAIL */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.EmailID || "-"}
                    </td>

                    {/* AADHAR */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.AadharNo || "-"}
                    </td>

                    {/* PAN */}

                    <td className="px-6 py-5 text-sm text-accent-foreground">
                      {user.PAN || "-"}
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.Status === "Active" ||
                          user.Status === "ACTIVE" ||
                          user.Status === 1
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {user.Status || "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        {/* VIEW USER */}

                        {/* EDIT USER */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(user)}
                          className="text-accent-foreground hover:bg-primary/10 hover:text-primary/50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <Users className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

              <h3 className="text-xl font-semibold text-accent-foreground">
                No Users Found
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Try searching with another keyword.
              </p>
            </div>
          )}
        </div>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {Array.from({ length: data?.totalPages || 0 }).map((_, i) => (
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
              onClick={() =>
                setPage((p) => Math.min(p + 1, data?.totalPages || 1))
              }
              className={
                page === data?.totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
