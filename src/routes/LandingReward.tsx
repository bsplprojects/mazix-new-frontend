import { Trophy } from "lucide-react";

export default function LandingReward() {
  const rewardsnew = [
    {
      tier: "Bronze",
      pairs: "5",
      income: "₹2,500",
      bonus: "₹1,000",
      total: "₹3,500",
      reward: "--",
    },
    {
      tier: "Silver",
      pairs: "15",
      income: "₹7,500",
      bonus: "₹3,000",
      total: "₹10,500",
      reward: "Gift",
    },
    {
      tier: "Star",
      pairs: "40",
      income: "₹20,000",
      bonus: "₹6,000",
      total: "₹26,000",
      reward: "--",
    },
    {
      tier: "Double Star",
      pairs: "80",
      income: "₹40,000",
      bonus: "₹10,000",
      total: "₹50,000",
      reward: "--",
    },
    {
      tier: "Platinum",
      pairs: "180",
      income: "₹90,000",
      bonus: "₹20,000",
      total: "₹1,10,000",
      reward: "--",
    },
    {
      tier: "Director",
      pairs: "380",
      income: "₹1,90,000",
      bonus: "₹40,000",
      total: "₹2,30,000",
      reward: "--",
    },
    {
      tier: "Sapphire",
      pairs: "880",
      income: "₹4,40,000",
      bonus: "₹80,000",
      total: "₹5,20,000",
      reward: "National Tour",
    },
    {
      tier: "Diamond",
      pairs: "2,380",
      income: "₹11,90,000",
      bonus: "₹2,00,000",
      total: "₹12,90,000",
      reward: "Thailand Tour",
    },
    {
      tier: "Crown",
      pairs: "6,380",
      income: "₹31,90,000",
      bonus: "₹4,00,000",
      total: "₹35,90,000",
      reward: "Sri Lanka Tour",
    },
    {
      tier: "Crown Diamond",
      pairs: "14,380",
      income: "₹71,90,000",
      bonus: "₹8,00,000",
      total: "₹79,90,000",
      reward: "Dubai Tour",
    },
    {
      tier: "Ambassador",
      pairs: "29,380",
      income: "₹1,46,90,000",
      bonus: "₹20,00,000",
      total: "₹1,66,90,000",
      reward: "Singapore Tour",
    },
    {
      tier: "Crown Ambassador",
      pairs: "50,000",
      income: "₹2,50,00,000",
      bonus: "₹40,00,000",
      total: "₹2,90,00,000",
      reward: "Switzerland Tour",
    },
    {
      tier: "Prince",
      pairs: "75,000",
      income: "₹3,75,00,000",
      bonus: "₹80,00,000",
      total: "₹4,55,00,000",
      reward: "London Tour",
    },
    {
      tier: "Crown Prince",
      pairs: "1,00,000",
      income: "₹5,00,00,000",
      bonus: "₹1,00,00,000",
      total: "₹6,00,00,000",
      reward: "Cruise",
    },
    {
      tier: "King of Mazix",
      pairs: "1,50,000",
      income: "₹7,50,00,000",
      bonus: "₹2,00,00,000",
      total: "₹9,50,00,000",
      reward: "3 Country Trip",
    },
  ];

  const rewards = [
    {
      title: "Bronze",
      pairs: "5 Pairs",
      bonus: "₹1,000",
      reward: "Gift",
    },
    {
      title: "Silver Achiever",
      pairs: "15 Pairs",
      bonus: "₹3,000",
      reward: "Gift",
    },
    {
      title: "Star Achiever",
      pairs: "40 Pairs",
      bonus: "₹6,000",
      reward: "Gift + Momento",
    },
    {
      title: "Double Star Achiever",
      pairs: "80 Pairs",
      bonus: "₹10,000",
      reward: "Gift + Momento",
    },
    {
      title: "Platinum",
      pairs: "180 Pairs",
      bonus: "₹20,000",
      reward: "Gift",
    },
    {
      title: "Director",
      pairs: "380 Pairs",
      bonus: "₹40,000",
      reward: "Gift",
    },
    {
      title: "Sapphire",
      pairs: "880 Pairs",
      bonus: "₹80,000",
      reward: "National Tour",
    },
    {
      title: "Diamond",
      pairs: "2380 Pairs",
      bonus: "₹2,00,000",
      reward: "Thailand Tour",
    },
    {
      title: "Crown",
      pairs: "6380 Pairs",
      bonus: "₹4,00,000",
      reward: "Sri Lanka Tour",
    },
    {
      title: "Crown Diamond",
      pairs: "14380 Pairs",
      bonus: "₹8,00,000",
      reward: "Dubai Tour",
    },
    {
      title: "Ambassador",
      pairs: "29380 Pairs",
      bonus: "₹20,00,000",
      reward: "Singapore Tour",
    },
    {
      title: "Crown Ambassador",
      pairs: "50,000 Pairs",
      bonus: "₹40,00,000",
      reward: "Switzerland Trip",
    },
    {
      title: "Prince",
      pairs: "75,000 Pairs",
      bonus: "₹80,00,000",
      reward: "London Tour",
    },
    {
      title: "Crown Prince",
      pairs: "1,00,000 PV",
      bonus: "₹1,00,00,000",
      reward: "Star Cruise",
    },
    {
      title: "King Of Mazix",
      pairs: "1,50,000 PV",
      bonus: "₹2,00,00,000",
      reward: "3 Country Tour",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-14 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          The Sweet Smell of Success
        </h1>
        <p className="mt-2 opacity-90">Recognition & Rewards</p>
      </section>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-gray-700 leading-7 text-justify">
          At Mazix, success comes handy to those who work with dedication and
          high aspirations. Every achievement brings rewards, recognition,
          confidence, and new opportunities to grow.
        </p>

        <SectionTitle title="Recognition" />
        <p className="text-gray-700 leading-7 text-justify">
          Hard work gets recognized at every stage. Your achievements are
          showcased publicly, giving you recognition among thousands of people.
        </p>

        <SectionTitle title="Awards" />
        <p className="text-gray-700 leading-7 text-justify">
          Every achiever earns identity through Pins and Titles reflecting
          skills, leadership, and success.
        </p>

        <SectionTitle title="Rewards" />
        <p className="text-gray-700 leading-7 text-justify">
          Higher achievements promote you to the Mazix Achievers Club where
          success unlocks lifestyle rewards.
        </p>

        {/* RANKS */}
        <h2 className="text-2xl font-bold text-center mt-5 mb-8 text-gray-600">
          Mazix Awards – Ranks & Pins
        </h2>

        {/* TABLE */}
        <div className="">
          <div className="rounded-2xl border border-white/10 bg-[#0b0f19] text-white shadow-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-[#0f172a]">
              <Trophy className="h-5 w-5 text-emerald-400" />
              <h2 className="font-bold text-lg">Rewards Plan</h2>
            </div>

            <div className="grid grid-cols-6 gap-2 text-xs font-semibold p-3 bg-[#111827] text-gray-300">
              <div>Tier</div>
              <div>Pairs</div>
              <div>Income</div>
              <div>Bonus</div>
              <div>Total</div>
              <div>Reward</div>
            </div>

            <div className="divide-y divide-white/10">
              {rewardsnew.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 p-3 text-sm items-center hover:bg-white/5 transition"
                >
                  <div className="text-white font-medium">{r.tier}</div>
                  <div className="text-gray-300 font-mono">{r.pairs}</div>
                  <div className="text-gray-300">{r.income}</div>
                  <div className="text-blue-400 font-medium">{r.bonus}</div>
                  <div className="text-emerald-400 font-bold">{r.total}</div>
                  <div className="text-gray-300">{r.reward}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="text-lg font-bold text-blue-700">{item.title}</h3>

              <p className="mt-2 text-sm text-gray-600">
                Qualification: {item.pairs}
              </p>

              <ul className="mt-4 text-sm space-y-1 text-black">
                <li>✔ Pin & Certificate</li>
                <li>✔ Website Recognition</li>
                <li>✔ Bonus: {item.bonus}</li>
                <li>✔ Reward: {item.reward}</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* SECTION TITLE */
function SectionTitle({ title }) {
  return (
    <h2 className="mt-10 mb-3 text-xl font-bold text-blue-700 border-l-4 border-blue-600 pl-3">
      {title}
    </h2>
  );
}
