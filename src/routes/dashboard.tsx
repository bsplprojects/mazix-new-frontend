import { Outlet, useNavigate } from "react-router-dom";
import { Search, LogOut, Dot } from "lucide-react";
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
import { ModeToggle } from "@/components/ModeToggle";
import { searchPages } from "@/data/constants";



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
          <header className="h-16 flex items-center justify-between gap-4 px-4 lg:px-6 border-b border-border bg-card/40 backdrop-blur-md sticky top-0 z-30">
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
            {/* <div className="flex-1 md:hidden" /> */}

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
              <ModeToggle />
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
