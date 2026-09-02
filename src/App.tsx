import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { lazy } from "react";

import { Checkout } from "./routes/dashboard.checkout";
import TeamBV from "./routes/dashboard.teamBV";
import AdminRepWalletTransferReport from "./routes/admin/AdminRepWalletTransferReport";
import RepInvoice from "./routes/RepInvoice";
import Stock from "./routes/admin/Stock";
import InvoiceList from "./routes/admin/InvoiceList";
import StockInvoice from "./routes/admin/StockInvoice";
import StockReport from "./routes/admin/StockReport";
import AdminLeftTeam from "./routes/admin/AdminLeftTeam";
import AdminRightTeam from "./routes/admin/AdminRightTeam";
import PayoutReport from "./routes/admin/PayoutReport";
import Offer from "./routes/admin/Offer";
import OfferReport from "./routes/admin/OfferReport";
const KYC = lazy(() => import("./routes/admin/KYC"));
const AddUser = lazy(() => import("./routes/admin/AddUser"));
const ChangePassword = lazy(() => import("./routes/admin/ChangePassword"));
const PANConfirmation = lazy(() => import("./routes/admin/PANConfirmation"));
const OldPANConfirmation = lazy(
  () => import("./routes/admin/OldPANConfirmation"),
);
const DatewiseDownline = lazy(() => import("./routes/DatewiseDownline"));
const RepHistory = lazy(() => import("./routes/RepHistory"));
const InvoiceAtJoining = lazy(() => import("./routes/admin/InvoiceAtJoining"));
const Tree = lazy(() => import("./routes/Tree"));
const Franchise = lazy(() => import("./routes/admin/Franchise"));
const PurchaseInvoice = lazy(() => import("./routes/admin/PurchaseInvoice"));
const AdminSupport = lazy(() => import("./routes/admin/AdminSupport"));
const Settings = lazy(() => import("./routes/admin/Settings"));
const MemberPaymentTransfer = lazy(
  () => import("./routes/admin/MemberPaymnetTransfer"),
);

const Protected = lazy(() => import("./components/Protected"));
const GSTReport = lazy(() => import("./routes/admin/GSTReport"));
const AdminMemberCredentials = lazy(
  () => import("./routes/admin/AdminMemberCredentials"),
);

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
const Profile = lazy(() => import("./routes/dashboard.userprofile"));
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

          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Dashboard */}
          <Route element={<Protected />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route
                path="/dashboard/team/dashboard"
                element={<TeamDashboard />}
              />
              <Route path="/dashboard/team/bv" element={<TeamBV />} />
              <Route path="/dashboard/team/updown" element={<UpdownTeam />} />
              <Route
                path="/dashboard/team/binary"
                element={<BinaryTreePage />}
              />
              <Route path="/dashboard/team/direct" element={<DirectTeam />} />
              <Route path="/dashboard/team/left-right" element={<Team />} />
              <Route
                path="/dashboard/team/right-team"
                element={<RightTeam />}
              />
              <Route path="/dashboard/team/left-team" element={<LeftTeam />} />
              <Route
                path="/dashboard/statement/:id"
                element={<PayoutStatement />}
              />
              <Route
                path="/dashboard/team/datewise"
                element={<DatewiseDownline />}
              />
              <Route path="/dashboard/team/tree" element={<Tree />} />
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
                path="/dashboard/repurchase/invoice"
                element={<RepInvoice />}
              />
              <Route path="/dashboard/checkout" element={<Checkout />} />

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
              <Route
                path="/dashboard/inv-joining"
                element={<InvoiceAtJoining />}
              />
              <Route path="/dashboard/old-income" element={<OldIncome />} />
              <Route path="/dashboard/my-payout" element={<MyPayout />} />
            </Route>
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="/admin/all-users" element={<AllUsersPage />} />
            <Route path="/admin/org1" element={<AdminLeftTeam />} />
            <Route path="/admin/org2" element={<AdminRightTeam />} />
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

            <Route path="/admin/payout-report" element={<PayoutReport />} />
            <Route path="/admin/offers/new" element={<Offer />} />

            <Route
              path="/admin/rep-wallet-transfer-report"
              element={<AdminRepWalletTransferReport />}
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
            <Route path="/admin/gst-report" element={<GSTReport />} />
            <Route path="/admin/offer-report" element={<OfferReport />} />
            <Route path="/admin/franchise" element={<Franchise />} />
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
            <Route
              path="/admin/wallet/member-payment"
              element={<MemberPaymentTransfer />}
            />
            <Route path="/admin/purchase-report" element={<PurchaseReport />} />
            <Route
              path="/admin/purchase-report/invoice/:id"
              element={<PurchaseInvoice />}
            />
            <Route path="/admin/edit-user/:id" element={<EditUserPage />} />
            <Route path="/admin/token" element={<AdminTokenList />} />
            <Route path="/admin/token-send" element={<SendToken />} />
            <Route path="/admin/package-master" element={<PackageMaster />} />
            <Route path="/admin/news-feed" element={<NewsFeed />} />
            <Route path="/admin/events-master" element={<EventMaster />} />
            <Route
              path="/admin/credentials"
              element={<AdminMemberCredentials />}
            />

            <Route path="/admin/product" element={<Product />} />
            <Route path="/admin/stock" element={<Stock />} />
            <Route path="/admin/invoice-list" element={<InvoiceList />} />
            <Route path="/admin/invoice/stock" element={<StockInvoice />} />
            <Route path="/admin/stock-report" element={<StockReport />} />
            <Route path="/admin/category" element={<Category />} />
            <Route path="/admin/kyc" element={<KYC />} />
            <Route path="/admin/support" element={<AdminSupport />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}
