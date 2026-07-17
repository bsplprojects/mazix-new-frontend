import { Outlet, useNavigate } from "react-router-dom";
import { Search, LogOut, Users, Box, Receipt, Dot } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";

export const searchPages = [
  {
    title: "Overview",
    url: "/dashboard",
    keywords: ["overview", "dashboard", "home"],
  },

  {
    title: "Team Dashboard",
    url: "/dashboard/team/dashboard",
    keywords: ["team", "dashboard", "network", "summary"],
  },
  {
    title: "Updown Team",
    url: "/dashboard/team/updown",
    keywords: ["updown", "upline", "downline", "team"],
  },
  {
    title: "Direct Team",
    url: "/dashboard/team/direct",
    keywords: ["direct", "referral", "sponsor", "team"],
  },
  {
    title: "ORG 1",
    url: "/dashboard/team/left-team",
    keywords: ["org1", "left", "left team", "tree", "genealogy"],
  },
  {
    title: "ORG 2",
    url: "/dashboard/team/right-team",
    keywords: ["org2", "right", "right team", "tree", "genealogy"],
  },
  {
    title: "Datewise Downline",
    url: "/dashboard/team/datewise",
    keywords: ["datewise", "downline", "team", "joining date"],
  },
  {
    title: "Member Structure",
    url: "/dashboard/team/tree",
    keywords: ["tree", "member structure", "hierarchy", "genealogy"],
  },

  {
    title: "New User",
    url: "/dashboard/userinfo",
    keywords: ["new user", "registration", "signup", "join", "member"],
  },

  {
    title: "Repurchase",
    url: "/dashboard/repurchase",
    keywords: ["repurchase", "purchase", "buy", "shopping"],
  },
  {
    title: "Repurchase History",
    url: "/dashboard/repurchase/history",
    keywords: ["repurchase history", "purchase history", "orders"],
  },

  {
    title: "My Payout",
    url: "/dashboard/my-payout",
    keywords: ["payout", "income", "earning", "commission"],
  },
  {
    title: "Old Payout",
    url: "/dashboard/old-income",
    keywords: ["old payout", "old income", "previous income", "history"],
  },
  {
    title: "Rewards",
    url: "/dashboard/rewards",
    keywords: ["reward", "gift", "achievement", "bonus"],
  },
  {
    title: "Rank",
    url: "/dashboard/rank",
    keywords: ["rank", "designation", "level", "promotion"],
  },

  {
    title: "Joining Wallet",
    url: "/dashboard/wallet/joining-wallet",
    keywords: ["joining wallet", "wallet", "balance", "joining"],
  },
  {
    title: "Repurchase Wallet",
    url: "/dashboard/wallet/repurchase-wallet",
    keywords: ["repurchase wallet", "wallet", "balance", "shopping wallet"],
  },

  {
    title: "Profile",
    url: "/dashboard/profile",
    keywords: ["profile", "account", "my account", "settings"],
  },

  {
    title: "Welcome Letter",
    url: "/dashboard/welcome-letter",
    keywords: ["welcome", "letter", "joining letter"],
  },

  {
    title: "Invoice at Joining",
    url: "/dashboard/inv-joining",
    keywords: ["invoice", "joining invoice", "bill", "receipt"],
  },

  {
    title: "Member ID Card",
    url: "/dashboard/member-id-card",
    keywords: ["id card", "member card", "identity", "card"],
  },

  {
    title: "Plan",
    url: "/dashboard/landing-reward",
    keywords: ["plan", "reward plan", "business plan", "income plan"],
  },
];

export default function DashboardLayout() {
  const mid = sessionStorage.getItem("MID");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { memberDetail } = useDashboard(mid as string);
  const navigate = useNavigate();

  const m = memberDetail?.data;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const filteredPages = searchPages.filter((page) => {
    const haystack = [page.title, ...page.keywords].join(" ").toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

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
                  onClick={() => setOpen(true)}
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
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type a command or search..."
            value={search}
            onChangeCapture={(e) => setSearch(e.target.value)}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading={search}>
              {filteredPages.map((page) => (
                <CommandItem
                  key={page.url}
                  onSelect={() => {
                    navigate(page.url);
                    setOpen(false);
                  }}
                >
                  <Dot className="mr-2 h-4 w-4" />
                  <span>{page.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </SidebarProvider>
  );
}
