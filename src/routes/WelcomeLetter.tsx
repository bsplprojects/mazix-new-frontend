import logo from "@/assets/mazix-logo.png";
// import stamp from "@/assets/company-stamp.png";
// import signature from "@/assets/signature.png";
import html2pdf from "html2pdf.js";

export default function WelcomeLetter() {
  const member = {
    name: "Rahul Sharma",
    id: "MZX10245",
    sponsor: "MZX10001",
    joiningDate: "15 May 2026",
  };

  const letterNo = `MZX/WL/${member.id}`;

  /* ---------------- PDF DOWNLOAD ---------------- */

  const downloadPDF = () => {
    const element = document.getElementById("letter");

    html2pdf()
      .set({
        margin: 0,
        filename: `Meghdoot-Welcome-${member.id}.pdf`,
        html2canvas: {
          scale: 3,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(element)
      .save();
  };

  /* ---------------- PRINT ---------------- */

  // const printLetter = () => window.print();

  return (
    <div className="flex flex-col items-center gap-4 p-6  min-h-screen">
      {/* ACTION BUTTONS */}
      {/* <div className="flex gap-3 print:hidden">
        <button
          onClick={printLetter}
          className="px-5 py-2 bg-blue-600 text-white rounded"
        >
          Print
        </button>

        <button
          onClick={downloadPDF}
          className="px-5 py-2 bg-green-600 text-white rounded"
        >
          Download PDF
        </button>
      </div> */}

      {/* ================= LETTER ================= */}

      <div
        id="letter"
        className="
relative
bg-white
text-black
shadow-xl
w-full
max-w-[210mm]
min-h-[297mm]
p-6 md:p-[25mm]
mx-auto
"
      >
        {/* WATERMARK */}
        <img
          src={logo}
          className="
  absolute
  opacity-[0.05]
  w-[250px]
  md:w-[450px]
  top-1/2
  left-1/2
  -translate-x-1/2
  -translate-y-1/2
  pointer-events-none
"
        />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 border-b pb-4 text-center md:text-left">
          <img src={logo} className="h-16" />

          <div className="text-right text-black">
            <h1 className="text-xl font-bold">Meghdoot Marketing Pvt. Ltd.</h1>
            <p className="text-sm">Corporate Office, India</p>
            <p className="text-xs mt-1">Letter No: {letterNo}</p>
            <p className="text-xs">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-center text-2xl font-bold mt-6 underline">
          WELCOME LETTER
        </h2>

        {/* BODY */}
        <div className="mt-8 text-[15px] leading-8">
          <p>
            Dear <b>{member.name}</b>,
          </p>

          <p className="mt-4">
            We are pleased to welcome you as an authorized member of
            <b> Meghdoot Marketing Pvt. Ltd.</b>.
          </p>

          <p className="mt-4">Your registration details are as follows:</p>

          {/* DETAILS BOX */}
          <div className="mt-4 border rounded-lg p-5 bg-gray-50">
            <p>
              <b>Member ID :</b> {member.id}
            </p>
            <p>
              <b>Sponsor ID :</b> {member.sponsor}
            </p>
            <p>
              <b>Joining Date :</b> {member.joiningDate}
            </p>
          </div>

          <p className="mt-6">
            We wish you great success and prosperity in your journey with our
            organization.
          </p>

          <p className="mt-6">
            This is a computer generated letter and does not require manual
            signature.
          </p>
        </div>

        {/* SIGNATURE + STAMP */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mt-20">
          {/* DIGITAL SIGNATURE */}
          <div className="text-center">
            {/* <img src={signature} className="h-20 mx-auto" /> */}
            <p className="font-semibold border-t pt-1">Authorized Signatory</p>
          </div>

          {/* COMPANY STAMP */}
          <div className="text-center">
            {/* <img src={stamp} className="h-32 opacity-90" /> */}
            <p className="font-semibold">Company Seal</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-6 left-0 right-0 text-center text-sm border-t pt-3">
          www.mymazix.com | support@mazixmarketing.com
        </div>
      </div>

      {/* PRINT FIX */}
      <style>
        {`
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          body {
            background: white;
          }

          .print\\:hidden {
            display: none;
          }

          #letter {
            box-shadow: none;
            margin: 0;
          }
        }
        `}
      </style>
    </div>
  );
}
