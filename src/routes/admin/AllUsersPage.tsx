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

  const handleView = (user: any) => {
    console.log("View User", user);
    // navigate(`/admin/user/${user.MemberID}`)
  };

  const navigate = useNavigate();

  const handleEdit = (user: any) => {
    navigate(`/admin/edit-user/${user.MID}`);
  };
  const handlePassword = (user: any) => {
    console.log("Password View", user);
    // open password modal
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-yellow-500/10 via-black to-zinc-950 p-6 lg:p-8">
        <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-yellow-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[4px] text-yellow-400">
              <ShieldCheck className="h-4 w-4" />
              Admin Dashboard
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              All Members
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Manage all registered users, accounts & activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              // onClick={fetchUsers}
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <Button className="bg-linear-to-r from-yellow-400 to-yellow-600 text-black hover:opacity-90 h-11 px-5 rounded-xl font-semibold">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================
          TABLE SECTION
      ========================================= */}

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3 backdrop-blur-xl">
        {/* TOP BAR */}

        <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-yellow-400 to-yellow-600 text-black shadow-lg">
                <Users className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Member List
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Showing{" "}
                  <span className="font-semibold text-yellow-400">
                    {filteredUsers.length}
                  </span>{" "}
                  registered members
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-white/10 bg-white/[0.02] p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              {/* MEMBER ID */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Member ID
                </label>

                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />

                  <Input
                    placeholder="RMG1001"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="h-11 rounded-2xl border border-white/10 bg-zinc-900/80 pl-10 text-white placeholder:text-zinc-500 focus:border-yellow-500"
                  />
                </div>
              </div>

              {/* FROM DATE */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  From Date
                </label>

                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-11 rounded-2xl border border-white/10 bg-zinc-900/80 text-white focus:border-yellow-500"
                />
              </div>

              {/* TO DATE */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  To Date
                </label>

                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-11 rounded-2xl border border-white/10 bg-zinc-900/80 text-white focus:border-yellow-500"
                />
              </div>

              {/* SEARCH */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Search
                </label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />

                  <Input
                    placeholder="Name / Mobile"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-11 rounded-2xl border border-white/10 bg-zinc-900/80 pl-10 text-white placeholder:text-zinc-500 focus:border-yellow-500"
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
                  className="h-11 flex-1 rounded-2xl bg-linear-to-r from-yellow-400 to-yellow-600 font-semibold text-black"
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
                  className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-white hover:bg-white/10"
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
              <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
            </div>
          ) : (
            <table className="w-full min-w-[1000px]">
              <thead className="border-b border-white/10 bg-white/[0.03]">
                <tr className="text-left">
                  {/* TABLE HEADER */}
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Sr.
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Member ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Member
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Guardian Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Gender
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Age
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Address
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    District
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    State
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    PinCode
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Country
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Contact No
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Email ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Aadhar No
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    PAN
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user: any, index) => (
                  <tr key={index} className="transition hover:bg-white/[0.03]">
                    {/* SR NO */}
                    <td className="px-6 py-5 text-sm font-semibold text-zinc-300">
                      {index + 1}
                    </td>
                    {/* DATE */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {new Date(user.ModifyDate).toLocaleString("en-IN")}
                    </td>

                    {/* MEMBER ID */}

                    <td className="px-6 py-5 text-sm font-medium text-yellow-400">
                      {user.MemberID || user.MID || "-"}
                    </td>

                    {/* MEMBER */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="text-white font-medium">
                          {user.MemberName || "-"}
                        </div>
                      </div>
                    </td>

                    {/* GUARDIAN NAME */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user.GuardianName || "-"}
                    </td>

                    {/* GENDER */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user.Gender || "-"}
                    </td>

                    {/* AGE */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user.Age || "-"}
                    </td>

                    {/* ADDRESS */}

                    <td className="px-6 py-5 text-sm text-zinc-300 min-w-[250px]">
                      {user.Address || "-"}
                    </td>

                    {/* DISTRICT */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user.District || "-"}
                    </td>

                    {/* STATE */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user.State || "-"}
                    </td>

                    {/* PINCODE */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user.PinCode || "-"}
                    </td>

                    {/* COUNTRY */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user.Country || "-"}
                    </td>

                    {/* CONTACT */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user.ContactNo || user.MobileNo || "-"}
                    </td>

                    {/* EMAIL */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user.EmailID || "-"}
                    </td>

                    {/* AADHAR */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
                      {user.AadharNo || "-"}
                    </td>

                    {/* PAN */}

                    <td className="px-6 py-5 text-sm text-zinc-300">
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
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleView(user)}
                          className="text-zinc-400 hover:bg-blue-500/10 hover:text-blue-400"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* EDIT USER */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(user)}
                          className="text-zinc-400 hover:bg-yellow-500/10 hover:text-yellow-400"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {/* PASSWORD */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handlePassword(user)}
                          className="text-zinc-400 hover:bg-green-500/10 hover:text-green-400"
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* =========================================
              EMPTY STATE
          ========================================= */}

          {!loading && filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <Users className="mx-auto mb-4 h-14 w-14 text-zinc-700" />

              <h3 className="text-xl font-semibold text-white">
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
