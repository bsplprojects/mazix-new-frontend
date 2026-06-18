import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { lazy } from "react";
import KYC from "./routes/admin/KYC";
import AddUser from "./routes/admin/AddUser";
import ChangePassword from "./routes/admin/ChangePassword";
import PANConfirmation from "./routes/admin/PANConfirmation";
import OldPANConfirmation from "./routes/admin/OldPANConfirmation";
import DatewiseDownline from "./routes/DatewiseDownline";
import RepHistory from "./routes/RepHistory";

// Auth
const Signin = lazy(() => import("./routes/signin"));

// User Dashboard
const DashboardLayout = lazy(() => import("./routes/dashboard"));
const DashboardHome = lazy(() => import("./routes/dashboard.index"));
const BinaryTreePage = lazy(() => import("./routes/dashboard.binary"));
const DirectTeam = lazy(() => import("./routes/dashboard.direct"));
const Team = lazy(() => import("./routes/dashboard.team"));
const JoiningWallet = lazy(() => import("./routes/joining.wallet"));
const RepurchaseWallet = lazy(() => import("./routes/repurchase.wallet"));
const UserInfo = lazy(() => import("./routes/dashboard.UserInfo"));
const Profile = lazy(() => import("./routes/dashboard.profile"));
const LeftTeam = lazy(() => import("./routes/dashboard.leftteam"));
const RightTeam = lazy(() => import("./routes/dashboard.rightteam"));
const Repurchase = lazy(() => import("./routes/dashboard.repurchase"));
const Rewards = lazy(() => import("./routes/dashboard.rewards"));
const RankPage = lazy(() => import("./routes/dashboard.rank"));
const Support = lazy(() => import("./routes/dashboard.support"));
const WelcomeLetter = lazy(() => import("./routes/WelcomeLetter"));
const MemberIDCard = lazy(() => import("./routes/MemberIDCard"));
const LandingReward = lazy(() => import("./routes/LandingReward"));
const OldIncome = lazy(() => import("./routes/OldIncome"));
const MyPayout = lazy(() => import("./routes/MyPayout"));
const PayoutStatement = lazy(() => import("./routes/PayoutStatement"));
const TeamDashboard = lazy(() => import("./routes/TeamDashboard"));
const UpdownTeam = lazy(() => import("./routes/UpdownTeam"));
const JoiningWalletTransfer = lazy(
  () => import("./routes/JoiningWalletTransfer"),
);
const RepurchaseWalletTransfer = lazy(
  () => import("./routes/RepurchaseWalletTransfer"),
);

// Admin
const AdminLogin = lazy(() => import("./routes/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./routes/admin/dashboard"));
const AdminDashboardHome = lazy(
  () => import("./routes/admin/AdminDashboardHome"),
);
const AllUsersPage = lazy(() => import("./routes/admin/AllUsersPage"));
const EditUserPage = lazy(() => import("./routes/admin/EditUserPage"));
const SaleReport = lazy(() => import("./routes/admin/SaleReport"));
const PaymentTransferDetail = lazy(
  () => import("./routes/admin/PaymentTransferDetail"),
);
const TDSReport = lazy(() => import("./routes/admin/TDSReport"));
const AdminChargeReport = lazy(
  () => import("./routes/admin/AdminChargeReport"),
);
const WalletTransferReport = lazy(
  () => import("./routes/admin/WalletTransferReport"),
);
const RepurchaseReport = lazy(() => import("./routes/admin/RepurchaseReport"));
const RewardReport = lazy(() => import("./routes/admin/RewardReport"));
const ProductSaleReport = lazy(
  () => import("./routes/admin/ProductSaleReport"),
);
const SaleInvoiceReport = lazy(
  () => import("./routes/admin/SaleInvoiceReport"),
);
const PrintInvoice = lazy(() => import("./routes/admin/PrintInvoice"));
const PurchaseReport = lazy(() => import("./routes/admin/PurchaseReport"));
const RepurchaseVoucher = lazy(
  () => import("./routes/admin/RepurchaseVoucher"),
);
const AdminTokenList = lazy(() => import("./routes/admin/AdminTokenList"));
const SendToken = lazy(() => import("./routes/admin/SendToken"));
const PackageMaster = lazy(() => import("./routes/admin/PackageMaster"));
const NewsFeed = lazy(() => import("./routes/admin/NewsFeed"));
const EventMaster = lazy(() => import("./routes/admin/EventManager"));
const Product = lazy(() => import("./routes/admin/Product"));
const Category = lazy(() => import("./routes/admin/Category"));

export default function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Signin />} />
          <Route path="/statement/:id" element={<PayoutStatement />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route
              path="/dashboard/team/dashboard"
              element={<TeamDashboard />}
            />
            <Route path="/dashboard/team/updown" element={<UpdownTeam />} />
            <Route path="/dashboard/team/binary" element={<BinaryTreePage />} />
            <Route path="/dashboard/team/direct" element={<DirectTeam />} />
            <Route path="/dashboard/team/left-right" element={<Team />} />
            <Route path="/dashboard/team/right-team" element={<RightTeam />} />
            <Route path="/dashboard/team/left-team" element={<LeftTeam />} />
            <Route
              path="/dashboard/team/datewise"
              element={<DatewiseDownline />}
            />
            <Route
              path="/dashboard/wallet/repurchase-wallet"
              element={<RepurchaseWallet />}
            />
            <Route
              path="/dashboard/wallet/joining-wallet"
              element={<JoiningWallet />}
            />
            <Route path="/dashboard/userinfo" element={<UserInfo />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/repurchase" element={<Repurchase />} />
            <Route
              path="/dashboard/repurchase/history"
              element={<RepHistory />}
            />
            <Route path="/dashboard/rewards" element={<Rewards />} />
            <Route path="/dashboard/rank" element={<RankPage />} />
            <Route path="/dashboard/support" element={<Support />} />
            <Route
              path="/dashboard/welcome-letter"
              element={<WelcomeLetter />}
            />
            <Route
              path="/dashboard/member-id-card"
              element={<MemberIDCard />}
            />
            <Route
              path="/dashboard/landing-reward"
              element={<LandingReward />}
            />
            <Route path="/dashboard/old-income" element={<OldIncome />} />
            <Route path="/dashboard/my-payout" element={<MyPayout />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="/admin/all-users" element={<AllUsersPage />} />
            <Route path="/admin/sale-reports" element={<SaleReport />} />
            <Route
              path="/admin/transfer-payment"
              element={<PaymentTransferDetail />}
            />
            <Route path="/admin/tds-reports" element={<TDSReport />} />
            <Route path="/admin/admin-charge" element={<AdminChargeReport />} />
            <Route
              path="/admin/wallet-transfer"
              element={<WalletTransferReport />}
            />
            <Route
              path="/admin/repurchase-report"
              element={<RepurchaseReport />}
            />

            <Route
              path="/admin/repurchase-voucher"
              element={<RepurchaseVoucher />}
            />
            <Route path="/admin/reward-report" element={<RewardReport />} />
            <Route
              path="/admin/product-sale-report"
              element={<ProductSaleReport />}
            />
            <Route
              path="/admin/sale-invoice-report"
              element={<SaleInvoiceReport />}
            />
            <Route path="/admin/invoice" element={<PrintInvoice />} />
            <Route path="/admin/add-user" element={<AddUser />} />
            <Route path="/admin/password" element={<ChangePassword />} />
            <Route path="/admin/pan" element={<PANConfirmation />} />
            <Route path="/admin/old-pan" element={<OldPANConfirmation />} />
            <Route
              path="/admin/wallet/joining"
              element={<JoiningWalletTransfer />}
            />
            <Route
              path="/admin/wallet/repurchase"
              element={<RepurchaseWalletTransfer />}
            />
            <Route path="/admin/purchase-report" element={<PurchaseReport />} />
            <Route path="/admin/edit-user/:id" element={<EditUserPage />} />
            <Route path="/admin/token" element={<AdminTokenList />} />
            <Route path="/admin/token-send" element={<SendToken />} />
            <Route path="/admin/package-master" element={<PackageMaster />} />
            <Route path="/admin/news-feed" element={<NewsFeed />} />
            <Route path="/admin/events-master" element={<EventMaster />} />

            <Route path="/admin/product" element={<Product />} />
            <Route path="/admin/category" element={<Category />} />
            <Route path="/admin/kyc" element={<KYC />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}
