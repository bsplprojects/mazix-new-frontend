import logo from "@/assets/mazix-logo.png";
import Loader from "@/components/Loader";
import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import html2pdf from "html2pdf.js";
import { useRef } from "react";

export default function MemberIDCard() {
  const memberID = sessionStorage.getItem("memberID");
  const printRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["member-id", memberID],
    queryFn: async () => {
      const res = await axiosInstance.get(`/member/identity/${memberID}`);
      return res.data;
    },
  });

  const m = data?.[0];

  const printCard = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;

    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) return;

    printWindow.document.write(`
    <html>
      <head>
        <title>ID Card Print</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
          }

          @media print {
            body {
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const downloadPDF = () => {
    const element = document.getElementById("idcard");

    html2pdf()
      .set({
        margin: 5,
        filename: "Mazix-Hanging-ID.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4" },
      })
      .from(element)
      .save();
  };

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col items-center gap-4 p-6 ">
      {/* Buttons */}
      {/* <div className="flex gap-3 print:hidden">
        <button
          onClick={printCard}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Print
        </button>

        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Download PDF
        </button>
      </div> */}

      {/* PAGE */}
      <div
        id="idcard"
        ref={printRef}
        className=" p-10 grid md:grid-cols-2 gap-10"
      >
        {/* ================= FRONT ================= */}
        <div className="relative w-62.5 h-105 rounded-2xl overflow-hidden shadow-2xl text-white mx-auto">
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-b from-cyan-600 to-blue-800" />

          {/* Lanyard Hole */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 h-5 w-16 bg-black/40 rounded-full" />

          {/* Logo */}
          <div className="relative flex justify-center mt-8">
            <img src={logo} className="h-14" />
          </div>

          {/* Photo */}
          <div className="relative flex justify-center mt-6">
            <img
              src={m?.PhotoPath}
              className="h-28 w-28 rounded-xl border-4 border-white object-cover"
            />
          </div>

          {/* Details */}
          <div className="relative text-center mt-6 space-y-2 px-4">
            <h2 className="font-bold text-lg">{m?.MemberName}</h2>

            <p className="text-sm">
              <b>ID :</b> {m?.MemberID}
            </p>

            <p className="text-sm">
              <b>Member Code :</b> {m?.MID}
            </p>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 w-full text-center text-xs bg-black/20 py-2">
            Meghdoot Marketing Pvt. Ltd.
          </div>
        </div>

        {/* ================= BACK ================= */}
        <div className="relative w-62.5 h-105 rounded-2xl overflow-hidden shadow-2xl bg-white border mx-auto">
          {/* Lanyard Hole */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 h-5 w-16 bg-gray-300 rounded-full" />

          {/* Header */}
          <div className="bg-orange-500 text-white text-center pt-10 pb-2 font-semibold">
            MEMBER INFORMATION
          </div>

          {/* Info */}
          <div className="p-5 text-sm space-y-3 text-black ">
            <p>
              <b>Name:</b> {m?.MemberName ?? "-"}
            </p>
            <p>
              <b>Member ID:</b> {m?.MemberID ?? "-"}
            </p>
            <p>
              <b>Mobile:</b> {m?.ContactNo ?? "-"}
            </p>
            <p>
              <b>Gender:</b> {m?.Gender ?? "-"}
            </p>

            <p className="text-xs mt-4">
              This card remains the property of Mazix Marketing Pvt Ltd. Misuse
              is strictly prohibited.
            </p>
          </div>

          {/* QR */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${m?.MemberID}`}
            />
          </div>
        </div>
      </div>

      {/* PRINT STYLE */}
      <style>
        {`
          @media print {

            body {
              background:white;
            }

            .print\\:hidden {
              display:none;
            }

            #idcard {
              gap:40px;
            }
          }
        `}
      </style>
    </div>
  );
}
