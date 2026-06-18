export const member = {
  name: "Aarav Mehta",
  id: "BIN-7421-AM",
  rank: "Diamond Director",
  nextRank: "Crown Diamond",
  rankProgress: 68,
  joined: "Mar 2023",
  sponsor: "Vikram Iyer (BIN-1209)",
  avatar: "AM",
  email: "aarav.mehta@example.com",
  walletBalance: 184250,
  pendingPayout: 24800,
  lifetimeEarnings: 1284900,
  directReferrals: 14,
  teamSize: 1284,
  leftBV: 482300,
  rightBV: 397500,
  carryForwardLeft: 84800,
  carryForwardRight: 0,
};

export const kpis = [
  {
    label: "Wallet Balance",
    value: "₹1,84,250",
    delta: "+12.4%",
    tone: "emerald" as const,
  },
  {
    label: "Lifetime Earnings",
    value: "₹12,84,900",
    delta: "+8.2%",
    tone: "brass" as const,
  },
  {
    label: "Team Size",
    value: "1,284",
    delta: "+42 this week",
    tone: "emerald" as const,
  },
  {
    label: "Pending Payout",
    value: "₹24,800",
    delta: "Releases Friday",
    tone: "brass" as const,
  },
];

export const earningsSeries = [
  {
    month: "Nov",
    purchase: 18000,
    repurchase: 9200,
    binary: 32000,
    reward: 12000,
  },
  {
    month: "Dec",
    purchase: 22000,
    repurchase: 11400,
    binary: 38000,
    reward: 15000,
  },
  {
    month: "Jan",
    purchase: 19000,
    repurchase: 13800,
    binary: 41000,
    reward: 18000,
  },
  {
    month: "Feb",
    purchase: 26000,
    repurchase: 16200,
    binary: 47000,
    reward: 21000,
  },
  {
    month: "Mar",
    purchase: 31000,
    repurchase: 18900,
    binary: 54000,
    reward: 24000,
  },
  {
    month: "Apr",
    purchase: 28000,
    repurchase: 22100,
    binary: 62000,
    reward: 28000,
  },
];

export const recentTransactions = [
  {
    id: "TXN-9821",
    type: "Binary Bonus",
    amount: 8400,
    date: "Apr 28",
    status: "Credited",
  },
  {
    id: "TXN-9820",
    type: "Repurchase Bonus",
    amount: 1250,
    date: "Apr 27",
    status: "Credited",
  },
  {
    id: "TXN-9819",
    type: "Reward Payout",
    amount: 15000,
    date: "Apr 25",
    status: "Credited",
  },
  {
    id: "TXN-9818",
    type: "Withdrawal",
    amount: -25000,
    date: "Apr 22",
    status: "Processed",
  },
  {
    id: "TXN-9817",
    type: "Direct Referral",
    amount: 4200,
    date: "Apr 20",
    status: "Credited",
  },
  {
    id: "TXN-9816",
    type: "Sponsor Bonus",
    amount: 1800,
    date: "Apr 19",
    status: "Credited",
  },
];

export const products = [
  {
    id: "P-101",
    name: "Vitality Wellness Pack",
    bv: 250,
    price: 4999,
    image: "🌿",
    tier: "Starter",
  },
  {
    id: "P-102",
    name: "Executive Bundle",
    bv: 600,
    price: 11999,
    image: "💼",
    tier: "Growth",
  },
  {
    id: "P-103",
    name: "Diamond Premium Kit",
    bv: 1500,
    price: 29999,
    image: "💎",
    tier: "Premium",
  },
  {
    id: "P-104",
    name: "Crown Suite",
    bv: 3000,
    price: 59999,
    image: "👑",
    tier: "Elite",
  },
];

export const repurchaseHistory = [
  {
    id: "RP-441",
    product: "Vitality Wellness Pack",
    date: "Apr 12",
    bv: 250,
    amount: 4999,
  },
  {
    id: "RP-440",
    product: "Executive Bundle",
    date: "Mar 14",
    bv: 600,
    amount: 11999,
  },
  {
    id: "RP-439",
    product: "Vitality Wellness Pack",
    date: "Feb 11",
    bv: 250,
    amount: 4999,
  },
  {
    id: "RP-438",
    product: "Diamond Premium Kit",
    date: "Jan 09",
    bv: 1500,
    amount: 29999,
  },
];

export const rewards = [
  {
    tier: "Silver",
    target: "5,000 BV pair",
    reward: "₹5,000 Cash",
    achieved: true,
  },
  {
    tier: "Gold",
    target: "25,000 BV pair",
    reward: "Goa Trip",
    achieved: true,
  },
  {
    tier: "Platinum",
    target: "1L BV pair",
    reward: "iPhone 15 Pro",
    achieved: true,
  },
  {
    tier: "Diamond",
    target: "5L BV pair",
    reward: "Bali Tour + ₹50,000",
    achieved: true,
  },
  {
    tier: "Crown",
    target: "15L BV pair",
    reward: "Royal Enfield + ₹2L",
    achieved: false,
    progress: 64,
  },
  {
    tier: "Ambassador",
    target: "50L BV pair",
    reward: "Mahindra Thar",
    achieved: false,
    progress: 18,
  },
  {
    tier: "Royal Crown",
    target: "1Cr BV pair",
    reward: "Europe Tour + Car Fund",
    achieved: false,
    progress: 6,
  },
];

export const ranks = [
  { name: "Star", achieved: true },
  { name: "Bronze", achieved: true },
  { name: "Silver", achieved: true },
  { name: "Gold", achieved: true },
  { name: "Platinum", achieved: true },
  { name: "Diamond", achieved: true, current: true },
  { name: "Crown Diamond", achieved: false },
  { name: "Royal Crown", achieved: false },
  { name: "Ambassador", achieved: false },
];

export type TreeNode = {
  id: string;
  name: string;
  rank: string;
  bv: number;
  active: boolean;
  left?: TreeNode;
  right?: TreeNode;
};

export const binaryTree: TreeNode = {
  id: "BIN-7421",
  name: "Aarav Mehta (You)",
  rank: "Diamond",
  bv: 879800,
  active: true,
  left: {
    id: "BIN-8120",
    name: "Priya Sharma",
    rank: "Platinum",
    bv: 482300,
    active: true,
    left: {
      id: "BIN-9011",
      name: "Rohit Verma",
      rank: "Gold",
      bv: 184000,
      active: true,
      left: {
        id: "BIN-9201",
        name: "Anjali R.",
        rank: "Silver",
        bv: 62000,
        active: true,
      },
      right: {
        id: "BIN-9202",
        name: "Karan S.",
        rank: "Bronze",
        bv: 41000,
        active: false,
      },
    },
    right: {
      id: "BIN-9012",
      name: "Meera Joshi",
      rank: "Gold",
      bv: 152000,
      active: true,
      left: {
        id: "BIN-9203",
        name: "Dev T.",
        rank: "Silver",
        bv: 58000,
        active: true,
      },
      right: {
        id: "BIN-9204",
        name: "Nisha P.",
        rank: "Bronze",
        bv: 28000,
        active: true,
      },
    },
  },
  right: {
    id: "BIN-8121",
    name: "Arjun Kapoor",
    rank: "Platinum",
    bv: 397500,
    active: true,
    left: {
      id: "BIN-9013",
      name: "Sneha Patel",
      rank: "Gold",
      bv: 142000,
      active: true,
      left: {
        id: "BIN-9205",
        name: "Yash M.",
        rank: "Silver",
        bv: 51000,
        active: true,
      },
      right: {
        id: "BIN-9206",
        name: "Ira K.",
        rank: "Bronze",
        bv: 32000,
        active: true,
      },
    },
    right: {
      id: "BIN-9014",
      name: "Vikas Singh",
      rank: "Silver",
      bv: 98000,
      active: true,
      left: {
        id: "BIN-9207",
        name: "Rhea D.",
        rank: "Bronze",
        bv: 24000,
        active: true,
      },
      right: {
        id: "BIN-9208",
        name: "Open Slot",
        rank: "—",
        bv: 0,
        active: false,
      },
    },
  },
};

export const notifications = [
  {
    id: 1,
    title: "Binary Bonus Credited",
    desc: "₹8,400 added to your wallet.",
    time: "2h ago",
    type: "success",
  },
  {
    id: 2,
    title: "Rank Advancement",
    desc: "You're 32% away from Crown Diamond.",
    time: "1d ago",
    type: "info",
  },
  {
    id: 3,
    title: "New Team Member",
    desc: "Rhea D. joined under your right leg.",
    time: "2d ago",
    type: "info",
  },
  {
    id: 4,
    title: "Repurchase Reminder",
    desc: "Maintain BV — repurchase due in 6 days.",
    time: "3d ago",
    type: "warning",
  },
];
