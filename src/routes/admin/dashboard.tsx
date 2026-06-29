import { Outlet, useNavigate } from "react-router-dom";
import { Bell, Search, LogOut, ShieldCheck } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const adminToken = sessionStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin-login");
    }
  }, [adminToken]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/admin-login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-linear-to-br from-zinc-950 via-black to-zinc-900 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 flex items-center gap-4 px-4 lg:px-6 border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
            {/* Sidebar Toggle */}
            <SidebarTrigger className="text-zinc-400 hover:text-white transition" />

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />

                <Input
                  placeholder="Search users, reports, payouts..."
                  className="pl-9 h-10 bg-zinc-900/70 border-white/10 text-white placeholder:text-zinc-500 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
            </div>

            <div className="flex-1 md:hidden" />

            {/* Notification */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-zinc-300 hover:text-white hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />

              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.9)]" />
            </Button>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              {/* Name */}
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-white leading-tight">
                  Super Admin
                </div>

                <div className="text-[10px] uppercase tracking-[2px] text-yellow-400">
                  Administrator
                </div>
              </div>

              {/* Avatar */}
              <div className="h-10 w-10 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <ShieldCheck className="h-5 w-5 text-black" />
              </div>
            </div>
            {/* Logout */}
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="ml-auto"
              title="Logout"
            >
              <LogOut className="h-5 w-5" /> Logout
            </Button>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 lg:p-7">
            {/* Top Welcome */}
            {/* <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <UserCog className="h-7 w-7 text-black" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Admin Dashboard
                  </h1>

                  <p className="text-sm text-zinc-400 mt-1">
                    Manage members, income, reports & system settings.
                  </p>
                </div>
              </div>
            </div> */}

            {/* Page Content */}
            <Outlet />
          </main>
        </div>

        {/* Toast */}
        <Toaster richColors position="top-right" />
      </div>
    </SidebarProvider>
  );
}
