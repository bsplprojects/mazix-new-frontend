import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ToWords } from "to-words";
import { Loader2 } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import logo from "/meghdoot_logo-original.png";

const converter = new ToWords({
  localeCode: "hi-IN",
  converterOptions: {
    currency: true,
  },
});

const StockInvoice = () => {
  const [params] = useSearchParams();
  const id = params.get("id");
  const printRef = useRef<HTMLDivElement>(null);

  const { data: receipt, isLoading } = useQuery({
    queryKey: ["inv-receipt"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/invoice/stock?id=${id}`);
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="w-full flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

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

  // const handlePdf = () => {};

  return (
    <>
      <Button onClick={handlePrint} className="mb-4">
        Print
      </Button>
      {/* <Button onClick={handlePdf} className="mb-4">
        PDF
      </Button> */}

      <main
        style={{
          width: "100%",
          background: "white",
          height: "100vh",
          color: "black",
          padding: "30px",
        }}
      >
        <section
          ref={printRef}
          style={{
            width: "1000px",
            border: "1px solid #ccc",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          {/* top header - logo + name & invoice no. */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* logo & branding */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0px",
                alignItems: "start",
              }}
            >
              <img
                src={logo}
                alt="meghdoot"
                style={{
                  height: "60px",
                }}
              />
              <h4
                style={{
                  fontWeight: "500",
                }}
              >
                Mazix unit of Meghdoot Marketing Pvt. Ltd.
              </h4>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                GSTIN: 20AAGCM6773RIZV
              </span>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Ranchi, Jharkhand
              </span>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Phone: 9955613671
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
            >
              <h4
                style={{
                  fontWeight: "500",
                }}
              >
                TAX INVOICE
              </h4>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Invoice No:{" "}
                {receipt?.invoice?.invoiceNo + "/" + receipt?.invoice?.id}{" "}
              </span>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Date:{" "}
                {new Date(receipt?.invoice?.date).toLocaleDateString("en-IN") ??
                  "-"}
              </span>
            </div>
          </div>

          {/* Billing information */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            {/* logo & branding */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0px",
                alignItems: "start",
              }}
            >
              <h4
                style={{
                  fontWeight: "500",
                }}
              >
                Billed To:
              </h4>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Name: {receipt?.invoice?.customerName ?? "-"}
              </span>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Phone: {receipt?.invoice?.customerPhone ?? "-"}
              </span>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Email: {receipt?.invoice?.customerEmail ?? "-"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
            >
              <h4
                style={{
                  fontWeight: "500",
                }}
              >
                Payment Details
              </h4>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Pay Mode: {receipt?.invoice?.paymentMode ?? "-"}
              </span>
            </div>
          </div>

          {/* PRODUCT DETAILS TABLE */}
          <table
            style={{
              width: "100%",
              marginTop: "40px",
              border: "1px solid #ccc",
            }}
          >
            <thead>
              <tr
                style={{
                  fontSize: "14px",
                  backgroundColor: "#dddddd",
                  color: "#25343F",
                }}
              >
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Taxable</th>
                <th>GST%</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {receipt?.invoiceItems?.map((product: any, index: number) => (
                <tr
                  key={index}
                  style={{
                    textAlign: "center",
                    fontSize: "14px",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{product?.name}</td>
                  <td>{product?.qty}</td>
                  <td>{product?.taxableAmount}</td>
                  <td>{product?.GST}</td>
                  <td>{product?.GSTAmount / 2}</td>
                  <td>{product?.GSTAmount / 2}</td>
                  <td>{product?.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Subtotal and grand total */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "24px 0px",
            }}
          >
            <table
              style={{
                width: "320px",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderCollapse: "collapse",
                backgroundColor: "#fff",
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "3px 8px",
                      borderBottom: "1px solid #d1d5db",
                      textAlign: "left",
                    }}
                  >
                    Sub Total (Taxable)
                  </td>
                  <td
                    style={{
                      padding: "3px 8px",
                      borderBottom: "1px solid #d1d5db",
                      textAlign: "right",
                    }}
                  >
                    ₹{receipt?.invoice?.totalTaxable ?? "0"}
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      padding: "3px 8px",
                      borderBottom: "1px solid #d1d5db",
                      textAlign: "left",
                    }}
                  >
                    CGST
                  </td>
                  <td
                    style={{
                      padding: "3px 8px",
                      borderBottom: "1px solid #d1d5db",
                      textAlign: "right",
                    }}
                  >
                    ₹{receipt?.invoice?.totalGST / 2}
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      padding: "3px 8px",
                      borderBottom: "1px solid #d1d5db",
                      textAlign: "left",
                    }}
                  >
                    SGST
                  </td>
                  <td
                    style={{
                      padding: "3px 8px",
                      borderBottom: "1px solid #d1d5db",
                      textAlign: "right",
                    }}
                  >
                    ₹{receipt?.invoice?.totalGST / 2}
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      padding: "3px 8px",
                      borderBottom: "1px solid #d1d5db",
                      textAlign: "left",
                    }}
                  >
                    Discount
                  </td>
                  <td
                    style={{
                      padding: "3px 8px",
                      borderBottom: "1px solid #d1d5db",
                      textAlign: "right",
                    }}
                  >
                    ₹{receipt?.invoice?.totalDiscount ?? "0"}
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      padding: "3px 8px",
                      fontWeight: "bold",
                      backgroundColor: "#ddd",
                      textAlign: "left",
                    }}
                  >
                    Grand Total
                  </td>
                  <td
                    style={{
                      padding: "3px 8px",
                      fontWeight: "bold",
                      backgroundColor: "#ddd",
                      textAlign: "right",
                    }}
                  >
                    ₹{receipt?.invoice?.totalAmount ?? "0"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: "10px 0px",
              borderTop: "1px solid #ccc",
            }}
          >
            <h6
              style={{
                textTransform: "uppercase",
                fontWeight: "700",
                fontSize: "12px",
                textAlign: "right",
              }}
            >
              Amount in words :{" "}
              {converter.convert(receipt?.invoice?.totalAmount ?? 0, {
                currency: true,
              })}{" "}
              मात्र
            </h6>

            <h6
              style={{
                textTransform: "uppercase",
                fontWeight: "500",
                fontSize: "12px",
                color: "#6e6e6e",
                marginTop: "50px",
                textAlign: "right",
              }}
            >
              Authorized Signatory
            </h6>
          </div>
        </section>
      </main>
    </>
  );
};

export default StockInvoice;
