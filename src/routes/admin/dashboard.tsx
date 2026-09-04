import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AdminSidebar } from "@/components/admin/AdminSidebar";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { ModeToggle } from "@/components/ModeToggle";

export default function AdminLayout() {
  const navigate = useNavigate();

  const adminToken = sessionStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken) {
      navigate("/");
    }
  }, [adminToken]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-4 lg:px-6 border-b border-border/60 bg-background/80 backdrop-blur-xl">
            {/* Sidebar Toggle */}
            <SidebarTrigger className="text-muted-foreground hover:text-primary transition" />

            <div className="flex-1 md:hidden" />

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full bg-gradient-emerald shadow-glow flex items-center justify-center">
                <ShieldCheck className="text-primary-foreground" />
              </div>
              {/* Name */}
              <div className="text-left hidden sm:block">
                <div className="text-sm font-semibold text-foreground tracking-tight">
                  Super Admin
                </div>

                <div className="text-[10px] uppercase tracking-[2px] text-primary">
                  Administrator
                </div>
              </div>
            </div>
            {/* Logout */}
            <div className="ml-auto space-x-3">
              <ModeToggle />
              <Button
                onClick={handleLogout}
                variant="destructive"
                title="Logout"
              >
                <LogOut className="h-5 w-5" /> Logout
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 lg:p-7 bg-background">
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
      </div>
    </SidebarProvider>
  );
}
