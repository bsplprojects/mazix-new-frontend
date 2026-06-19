import { useState } from "react";
import { useParams } from "react-router-dom";
import { teamApi } from "@/services/teamApi";
import { useQuery } from "@tanstack/react-query";

export default function PayoutStatement() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  const { isLoading } = useQuery({
    queryKey: ["statement", id],
    queryFn: async () => {
      const res = await teamApi.statement(id as string);
      setData(res?.[0] || null);
    },
    enabled: !!id,
  });

  const printPage = () => window.print();

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="bg-white text-black max-w-4xl mx-auto p-6 print:p-0">
      {/* HEADER */}
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h1 className="text-xl font-bold">Mazix Marketing Pvt. Ltd.</h1>
          <p className="text-xs text-gray-600">
            Email: rkrajpragati6@gmail.com <br />
            Address: Kokar Chunna Bhatta, H.B Road Kokar,
            Ranchi-834001[Jharkhand]
          </p>
        </div>

        <div className="text-right">
          <h2 className="text-2xl font-bold tracking-widest text-gray-700">
            STATEMENT
          </h2>
        </div>
      </div>

      {/* TOP INFO */}
      <div className="grid grid-cols-2 gap-6 mt-6 text-sm">
        <div>
          <p>
            <b>Member ID:</b> {data.MemberID}
          </p>
          <p>
            <b>Member Name:</b> {data.MemberName}
          </p>
        </div>

        <div className="text-right">
          <p>
            <b>From:</b>{" "}
            {new Date(data.PayoutFromDate).toLocaleDateString("en-IN")}
          </p>
          <p>
            <b>To:</b> {new Date(data.PayoutToDate).toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      <div className="mt-6 border rounded-xl overflow-hidden">
        <h3 className="font-semibold p-3 bg-gray-100 border-b">
          Binary Details
        </h3>

        <div className="grid grid-cols-2 text-sm">
          <div className="p-4 border-r space-y-2">
            <p className="flex justify-between">
              <span>Current Left</span> <b>{data.CurrentLeft}</b>
            </p>
            <p className="flex justify-between">
              <span>Old Left</span> <b>{data.OldLeftCarry}</b>
            </p>
            <p className="flex justify-between">
              <span>Repurchase Left</span> <b>{data.PurCurrentLeft}</b>
            </p>
          </div>

          <div className="p-4 space-y-2">
            <p className="flex justify-between">
              <span>Current Right</span> <b>{data.CurrentRight}</b>
            </p>
            <p className="flex justify-between">
              <span>Old Right</span> <b>{data.OldRightCarry}</b>
            </p>
            <p className="flex justify-between">
              <span>Repurchase Right</span> <b>{data.PurCurrentRight}</b>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SUMMARY */}
        <div className="border rounded-xl p-5 bg-gray-50 shadow-sm">
          <h3 className="font-semibold mb-4 text-gray-700">Income Summary</h3>

          <div className="grid grid-cols-3 text-sm gap-4">
            <div>
              <p className="text-gray-500">Total Income</p>
              <p className="font-bold">₹ {data.Amount}</p>
            </div>

            <div>
              <p className="text-gray-500">TDS</p>
              <p className="font-bold text-red-500">₹ {data.TDS}</p>
            </div>

            <div>
              <p className="text-gray-500">Net Payable</p>
              <p className="font-bold text-green-600">₹ {data.Payable}</p>
            </div>
          </div>
        </div>

        {/* EXTRA DETAILS */}
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <h3 className="font-semibold p-3 bg-gray-100 border-b">
            Bonus Details
          </h3>

          <div className="grid grid-cols-4 text-sm p-3">
            <div>
              <p className="text-gray-500">Pair</p>
              <p className="font-bold">{data.Pair}</p>
            </div>

            <div>
              <p className="text-gray-500">Admin</p>
              <p className="font-bold">{data.AdminCharge}</p>
            </div>

            <div>
              <p className="text-gray-500">Voucher</p>
              <p className="font-bold">{data.Vouchur}</p>
            </div>

            <div>
              <p className="text-gray-500">Bonus</p>
              <p className="font-bold text-purple-600">{data.Bonus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center mt-10 text-xs text-gray-500">
        Thank you for your business
      </div>

      {/* PRINT BUTTON */}
      <div className="text-center mt-6 print:hidden">
        <button
          onClick={printPage}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Print Statement
        </button>
      </div>
    </div>
  );
}
