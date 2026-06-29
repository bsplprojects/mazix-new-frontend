import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Package,
  FileText,
  Settings,
  LifeBuoy,
  BarChart3,
  UserPlus,
  CreditCard,
  TicketPercent,
  TicketSlash,
  Package2,
  Newspaper,
  Package2Icon,
  Lock,
  IdCard,
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

const adminMain = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
];

const userManagement = [
  { title: "All Users", url: "/admin/all-users", icon: Users },
  // { title: "Add User", url: "/admin/add-user", icon: UserPlus },
  { title: "Change Password", url: "/admin/password", icon: Lock },
  { title: "KYC Requests", url: "/admin/kyc", icon: CreditCard },
  { title: "PAN Confirmation", url: "/admin/pan", icon: IdCard },
  // { title: "Old PAN Confirmation", url: "/admin/old-pan", icon: IdCard },
  { title: "Franchise", url: "/admin/franchise", icon: UserPlus },
];

const tokens = [
  { title: "Token List", url: "/admin/token", icon: TicketPercent },
  { title: "Send Token", url: "/admin/token-send", icon: TicketSlash },
];

const products = [
  { title: "Product", url: "/admin/product", icon: Package2Icon },
  { title: "Category", url: "/admin/category", icon: TicketSlash },
];

const setup = [
  {
    title: "Package Master",
    url: "/admin/package-master",
    icon: Package2,
  },
  {
    title: "News Feed",
    url: "/admin/news-feed",
    icon: Newspaper,
  },
  {
    title: "Events",
    url: "/admin/events-master",
    icon: Newspaper,
  },
];

const finance = [
  {
    title: "Joining Wallet Transfer",
    url: "/admin/wallet/joining",
    icon: Wallet,
  },
  {
    title: "Repurchase Wallet Transfer",
    url: "/admin/wallet/repurchase",
    icon: Package,
  },
];

const reports = [
  {
    title: "Transferred Payments",
    url: "/admin/transfer-payment",
    icon: BarChart3,
  },
  { title: "Sale Reports", url: "/admin/sale-reports", icon: BarChart3 },
  {
    title: "Purchase Reports",
    url: "/admin/purchase-report",
    icon: BarChart3,
  },
  { title: "TDS Details", url: "/admin/tds-reports", icon: BarChart3 },
  { title: "Admin Charge", url: "/admin/admin-charge", icon: BarChart3 },
  {
    title: "Wallet Transfer Report",
    url: "/admin/wallet-transfer",
    icon: BarChart3,
  },
  {
    title: "Repurchase Report",
    url: "/admin/repurchase-report",
    icon: BarChart3,
  },

  {
    title: "Repurchase (Voucher)",
    url: "/admin/repurchase-voucher",
    icon: BarChart3,
  },
  {
    title: "Reward Report",
    url: "/admin/reward-report",
    icon: BarChart3,
  },
  {
    title: "Product Sale Report",
    url: "/admin/product-sale-report",
    icon: BarChart3,
  },
  {
    title: "Sale Invoice",
    url: "/admin/sale-invoice-report",
    icon: BarChart3,
  },
  // { title: "Statements", url: "/admin/statements", icon: FileText },
];

// const settings = [
//   { title: "Support Tickets", url: "/admin/support", icon: LifeBuoy },
//   { title: "Settings", url: "/admin/settings", icon: Settings },
// ];

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

  const handleNavClick = () => {
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
            const active =
              current === item.url || current.startsWith(item.url + "/");

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

export function AdminSidebar() {
  const location = useLocation();
  const current = location.pathname;

  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-5 border-b border-sidebar-border">
        {collapsed ? (
          <div className="flex justify-center">
            <BrandMark size={32} />
          </div>
        ) : (
          <BrandMark />
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <MenuSection label="Overview" items={adminMain} current={current} />

        <MenuSection label="Setup" items={setup} current={current} />

        <MenuSection label="Product" items={products} current={current} />

        <MenuSection
          label="User Management"
          items={userManagement}
          current={current}
        />

        <MenuSection label="Token" items={tokens} current={current} />

        <MenuSection label="Wallet" items={finance} current={current} />

        <MenuSection label="Reports" items={reports} current={current} />

        {/* <MenuSection label="System" items={settings} current={current} /> */}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="rounded-lg bg-gradient-card p-3 border border-border/50">
            <div className="text-[10px] uppercase tracking-wider text-brass mb-1">
              Admin Panel
            </div>
            <div className="font-mono text-xs">Super Admin</div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
