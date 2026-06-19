import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LayoutGrid,
  RotateCw,
  Trophy,
  Wallet,
  Users,
  TrendingUp,
  User,
  History,
  FileText,
  CreditCard,
  FileAxis3d,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { BrandMark } from "@/components/brand-mark";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const main = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard, exact: true },
  // { title: "Binary Tree", url: "/dashboard/binary", icon: GitBranch },
  // { title: "Genealogy", url: "/dashboard/genealogy", icon: Search },

  {
    title: "Team",
    icon: Users,
    children: [
      { title: "Dashboard", url: "/dashboard/team/dashboard" },
      { title: "Updown Team", url: "/dashboard/team/updown" },
      { title: "Direct Team", url: "/dashboard/team/direct" },
      // { title: "Binary Genealogy", url: "/dashboard/team/binary" },
      // { title: "Left/Right Team", url: "/dashboard/team/left-right" },
      { title: "Left Team", url: "/dashboard/team/left-team" },
      { title: "Right Team", url: "/dashboard/team/right-team" },
      { title: "Datewise Downline", url: "/dashboard/team/datewise" },
      { title: "Tree", url: "/dashboard/team/tree" },
    ],
  },
  { title: "New User", url: "/dashboard/userinfo", icon: User },
];
const earn = [
  {
    title: "Repurchase",
    url: "/dashboard/repurchase",
    icon: RotateCw,
    children: [
      { title: "New", url: "/dashboard/repurchase" },
      { title: "History", url: "/dashboard/repurchase/history" },
      // { title: "Purchase List", url: "/dashboard/repurchase/list" },
    ],
  },
  // { title: "Orders", url: "/dashboard/orders", icon: Package },
  { title: "My Payout", url: "/dashboard/my-payout", icon: Wallet },
  { title: "Old Payout", url: "/dashboard/old-income", icon: History },
  { title: "Rewards", url: "/dashboard/rewards", icon: Trophy },
  { title: "Rank", url: "/dashboard/rank", icon: TrendingUp },
];
const acct = [
  {
    title: "Wallet",
    icon: Wallet,
    children: [
      { title: "Joining", url: "/dashboard/wallet/joining-wallet" },
      { title: "Repurchase", url: "/dashboard/wallet/repurchase-wallet" },
    ],
  },
  // { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
  // { title: "Support", url: "/dashboard/support", icon: LifeBuoy },

  { title: "Profile", url: "/dashboard/profile", icon: User },

  {
    title: "Welcome Letter",
    url: "/dashboard/welcome-letter",
    icon: FileText,
  },

  {
    title: "Invoice at joining",
    url: "/dashboard/inv-joining",
    icon: FileAxis3d,
  },

  {
    title: "Member ID Card",
    url: "/dashboard/member-id-card",
    icon: CreditCard,
  },
  {
    title: "Plan",
    url: "/dashboard/landing-reward",
    icon: LayoutGrid,
  },
];

function MenuSection({
  label,
  items,
  current,
}: {
  label: string;
  items: any[];
  current: string;
}) {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const handleNavClick = () => {
    setOpenMenu(null);
    setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      {!collapsed && (
        <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          {label}
        </SidebarGroupLabel>
      )}

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            /* DROPDOWN MENU */
            if (item.children) {
              const open = openMenu === item.title;

              return (
                <SidebarMenuItem key={item.title}>
                  <button
                    onClick={() => {
                      setOpenMenu(open ? null : item.title);
                    }}
                    className="flex items-center justify-between w-full h-10 px-3 rounded-md hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <span className="text-sm">{item.title}</span>
                      )}
                    </div>

                    {!collapsed && (
                      <ChevronDown
                        className={`h-4 w-4 transition ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* SUB MENU */}
                  {open && !collapsed && (
                    <div className="ml-8 mt-2 flex flex-col gap-1">
                      {item.children.map((sub: any) => (
                        <Link
                          key={sub.title}
                          to={sub.url}
                          onClick={() => {
                            setOpenMenu(null);
                            setOpenMobile(false); // only for mobile collapse
                          }}
                          className={`text-sm px-2 py-1 rounded-md hover:bg-accent block ${
                            current === sub.url ? "bg-primary text-white" : ""
                          }`}
                        >
                          {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              );
            }

            /*  NORMAL MENU */
            const active = item.exact
              ? current === item.url
              : current === item.url || current.startsWith(item.url + "/");

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active}>
                  <Link
                    to={item.url}
                    onClick={handleNavClick}
                    className="flex items-center gap-3"
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && (
                      <span className="text-sm">{item.title}</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
export function AppSidebar() {
  const location = useLocation();
  const current = location.pathname;
  const memberId = sessionStorage.getItem("memberID");
  const navigate = useNavigate();

  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-5 border-b border-sidebar-border">
        {collapsed ? (
          <Link to="/" className="flex justify-center">
            <BrandMark size={32} />
          </Link>
        ) : (
          <Link to={"/"}>
            <BrandMark />
          </Link>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <MenuSection label="Network" items={main} current={current} />
        <MenuSection label="Earnings" items={earn} current={current} />
        <MenuSection label="Account" items={acct} current={current} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="rounded-lg bg-gradient-card p-3 border border-border/50  flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-brass mb-1">
                Member ID
              </div>
              <div className="font-mono text-xs text-foreground">
                {memberId}
              </div>
            </div>
            <Button
              className="hover:bg-yellow-500"
              onClick={() => {
                sessionStorage.clear();
                navigate("/");
              }}
            >
              <LogOut />
              Logout
            </Button>
          </div>
        )}
        <p className="text-[12px] text-muted-foreground mt-2 text-center">
          All Rights Reserved by Mazix 2022 .
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
