import { Outlet, useNavigate } from "react-router-dom";
import { Bell, Search, LogOut } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardLayout() {
  const mid = sessionStorage.getItem("MID");
  const { memberDetail } = useDashboard(mid as string);
  const navigate = useNavigate();

  const m = memberDetail?.data;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-4 px-4 lg:px-6 border-b border-border bg-card/40 backdrop-blur-md sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground block lg:hidden" />
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search member, transaction, product…"
                  className="pl-9 h-9 bg-input/50 border-border"
                />
              </div>
            </div>
            <div className="flex-1 md:hidden" />
            {/* <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative"
              title="Cart"
            >
              <Link to="/dashboard/checkout" search={{ kind: cartTo }}>
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-brass text-brass-foreground text-[10px] font-semibold flex items-center justify-center shadow-brass">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button> */}
            {/* <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brass shadow-brass" />
            </Button> */}

            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium leading-tight">
                  {m?.MemberName ?? "Member"}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-brass">
                  {m?.MemberID ?? ""}
                </div>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-emerald flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-glow">
                {m?.MemberName?.slice(0, 1) ?? "M"}
              </div>
              <Button
                onClick={handleLogout}
                asChild
                variant="ghost"
                size="icon"
                title="Sign out"
                className="md:hidden"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
