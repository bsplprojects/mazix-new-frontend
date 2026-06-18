import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import logo from "/apple-touch-icon.png";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const thead = {
  border: "1px solid #DDDDDD",
  padding: "8px 12 px",
  color: "#25343F",
  fontSize: "12px",
};

const tbody = {
  border: "1px solid #DDDDDD",
  padding: "0.5rem",
  color: "#000",
  fontSize: "12px",
};

const totals = {
  color: "#000",
  fontWeight: "600",
  marginLeft: "10px",
};

const PrintInvoice = () => {
  const [searchParams] = useSearchParams();
  const MID = searchParams.get("MID");
  const printRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["invoice", MID],
    queryFn: async () => {
      const res = await axiosInstance.get(`/member/${MID}`);
      return res.data;
    },
  });

  const { data: prods } = useQuery({
    queryKey: ["products", MID],
    queryFn: async () => {
      const res = await axiosInstance.get(`/reports/products`, {
        params: {
          MemberID: MID,
        },
      });
      return res.data;
    },
  });

  const member = data?.data || {};
  const products = prods?.data || [];

  const totalTaxable = products?.reduce((acc: number, item: any) => {
    return item.TaxAbleAmnt + acc;
  }, 0);

  const totalSGST = products?.reduce((acc: number, item: any) => {
    return item.SGST + acc;
  }, 0);

  const totalCGST = products?.reduce((acc: number, item: any) => {
    return item.CGST + acc;
  }, 0);

  const totalIGST = products?.reduce((acc: number, item: any) => {
    return item.IGST + acc;
  }, 0);

  const totalMemberMRP = totalTaxable + totalSGST + totalCGST + totalIGST;

  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;

    if (!printContents) return;

    const printWindow = window.open("", "_blank");

    printWindow!.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: white;
            font-family: Arial, sans-serif;
          }

          @page {
            size: A4;
            margin: 15mm;
          }

          * {
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);

    printWindow!.document.close();

    printWindow!.onload = () => {
      printWindow!.focus();
      printWindow!.print();
      printWindow!.close();
    };
  };

  return (
    <main
      style={{
        width: "100%",
        border: "1px solid #3C3C3C",
        borderRadius: "10px",
        padding: "1rem",
        height: "100%",
      }}
    >
      <Button onClick={handlePrint}>Print</Button>
      <div
        ref={printRef}
        style={{
          width: "210mm", // A4 width
          minHeight: "297mm", // A4 height
          margin: "0 auto",
          background: "#fff",
          padding: "20mm",
          boxSizing: "border-box",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #e4e4e7",
          }}
        >
          <img src={logo} alt="logo" width={50} />
          <span
            style={{
              color: "#0047AC",
              fontWeight: "bold",
              fontSize: "23px",
            }}
          >
            MAZIX
          </span>
        </div>

        {/* header */}

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            borderLeft: "4px solid #0047AC",
            marginTop: "1rem",
            paddingLeft: "1rem",
          }}
        >
          {/* FROM */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                color: "#3C3C3C",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              FROM:
            </h3>
            <span
              style={{
                color: "#3C3C3C",
                fontSize: "12px",
              }}
            >
              MEGHDOOT MARKETING PVT.LTD
            </span>
            <span
              style={{
                color: "#3C3C3C",
                fontSize: "12px",
              }}
            >
              Email: rkrajpragati6@gmail.com
            </span>
            <span
              style={{
                color: "#3C3C3C",
                fontSize: "12px",
              }}
            >
              Mobile :9955613671
            </span>
            <span
              style={{
                color: "#3C3C3C",
                fontSize: "12px",
              }}
            >
              GST :20AAGCM6773R1ZV
            </span>
            <span
              style={{
                color: "#3C3C3C",
                fontSize: "12px",
              }}
            >
              CIN :U52299JH2010PTC014277
            </span>
            <span
              style={{
                color: "#3C3C3C",
                fontSize: "12px",
              }}
            >
              Address:Kokar Chunna Bhatta, H.B Road
            </span>
            <span
              style={{
                color: "#3C3C3C",
                fontSize: "12px",
              }}
            >
              Kokar,Ranchi-834001[Jharkhand]
            </span>
          </div>

          {/* TO */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                color: "#3C3C3C",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              TO:
            </h3>
            <span
              style={{
                color: "#3C3C3C",
                fontSize: "12px",
              }}
            >
              Member ID: {member?.MemberID}
            </span>
            <span
              style={{
                color: "#3C3C3C",
                fontSize: "12px",
              }}
            >
              Member Name: {member?.MemberName}
            </span>
            <span
              style={{
                color: "#3C3C3C",
                fontSize: "12px",
              }}
            >
              Gender: {member?.Gender}
            </span>
            <span
              style={{
                color: "#3C3C3C",
                fontSize: "12px",
              }}
            >
              Age: {member?.Age}
            </span>
            <span
              style={{
                color: "#3C3C3C",
                fontSize: "12px",
              }}
            >
              State: {member?.ExtraFD}
            </span>
          </div>
        </div>

        {/* Product Details*/}

        <div
          style={{
            marginTop: "1.5rem",
          }}
        >
          <h3
            style={{
              color: "green",
              marginBottom: "12px",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            Product Details
          </h3>

          <table
            style={{
              width: "100%",
              border: "1px solid #DDDDDD",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#DDDDDD",
                  color: "black",
                }}
              >
                <th style={thead} className="border px-3 py-2">
                  #
                </th>
                <th style={thead}>Product</th>
                <th style={thead}>MRP</th>
                <th style={thead}>Me.MRP</th>
                <th style={thead}>Qty</th>
                <th style={thead}>Net Amt</th>
                <th style={thead}>GST %</th>
                <th style={thead}>CGST</th>
                <th style={thead}>SGST</th>
                <th style={thead}>IGST</th>
                <th style={thead}>Total Amount</th>
              </tr>
            </thead>

            <tbody>
              {products?.map((item: any, index: number) => (
                <tr key={index}>
                  <td style={tbody}>{index + 1}</td>

                  <td style={tbody}>{item.ProductName}</td>

                  <td style={tbody}>{Number(item.MRP).toFixed(2)}</td>

                  <td style={tbody}>{Number(item.MemberMRP).toFixed(2)}</td>

                  <td style={tbody}>{item.Qty}</td>

                  <td style={tbody}>{Number(item.TaxAbleAmnt).toFixed(2)}</td>

                  <td style={tbody}>{item.GST}%</td>

                  <td style={tbody}>{Number(item.CGST).toFixed(2)}</td>

                  <td style={tbody}>{Number(item.SGST).toFixed(2)}</td>

                  <td style={tbody}>{Number(item.IGST).toFixed(2)}</td>

                  <td style={tbody}>
                    {(Number(item.MemberMRP) * Number(item.Qty)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                color: "#3C3C3C",
                fontSize: "15px",
              }}
            >
              Total Taxable:
              <span style={totals}> ₹{Number(totalTaxable).toFixed(2)}</span>
            </p>
            <p
              style={{
                color: "#3C3C3C",
                fontSize: "15px",
              }}
            >
              Total Member MRP:{" "}
              <span style={totals}> ₹{Number(totalMemberMRP).toFixed(2)}</span>
            </p>
            <p
              style={{
                color: "#3C3C3C",
                fontSize: "15px",
              }}
            >
              Total SGST:{" "}
              <span style={totals}> ₹{Number(totalSGST).toFixed(2)}</span>
            </p>
            <p
              style={{
                color: "#3C3C3C",
                fontSize: "15px",
              }}
            >
              Total CGST:{" "}
              <span style={totals}> ₹{Number(totalCGST).toFixed(2)}</span>
            </p>
            <p
              style={{
                color: "#3C3C3C",
                fontSize: "15px",
              }}
            >
              Total IGST:{" "}
              <span style={totals}> ₹{Number(totalIGST).toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrintInvoice;
