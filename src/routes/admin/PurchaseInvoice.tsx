import { axiosInstance } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ToWords } from "to-words";
import { Loader2 } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const converter = new ToWords({
  localeCode: "hi-IN",
  converterOptions: {
    currency: true,
  },
});

const PurchaseInvoice = () => {
  const { id } = useParams();
  const printRef = useRef<HTMLDivElement>(null);

  const { data: receipt, isLoading } = useQuery({
    queryKey: ["receipt"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/admin/purchase-receipt?orderNo=${id}`,
      );
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
                src="https://new.mazix.co.in/assets/img/logo_m.png"
                alt="meghdoot"
                style={{
                  height: "70px",
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
                Invoice No: {receipt?.data?.orderNo ?? "-"}
              </span>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Date:{" "}
                {new Date(receipt?.data?.orderDate).toLocaleDateString(
                  "en-IN",
                ) ?? "-"}
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
                Name: {receipt?.data?.customerName ?? "-"}
              </span>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Phone: {receipt?.data?.customerPhone ?? "-"}
              </span>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Email: {receipt?.data?.customerEmail ?? "-"}
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
                Pay Mode: {receipt?.data?.payMode ?? "-"}
              </span>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Payment: {receipt?.data?.paymentStatus ?? "-"}
              </span>
              <span
                style={{
                  fontSize: "14px",
                }}
              >
                Delivery: {receipt?.data?.deliveryStatus ?? "-"}
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
                <th>Rate(Incl. GST)</th>
                <th>Amount</th>
                <th>GST%</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
              </tr>
            </thead>
            <tbody>
              {receipt?.data?.items?.map((product: any, index: number) => (
                <tr
                  key={index}
                  style={{ textAlign: "center", fontSize: "14px" }}
                >
                  <td>{index + 1}</td>
                  <td>{product?.Product}</td>
                  <td>{product?.Qty}</td>
                  <td>{product?.Rate}</td>
                  <td>{product?.TaxableAmount}</td>
                  <td>{product?.GSTRate}</td>
                  <td>{product?.CGSTAmount}</td>
                  <td>{product?.SGSTAmount}</td>
                  <td>{product?.IGSTAmount}</td>
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
                    ₹{receipt?.data?.subTotal ?? "0"}
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
                    ₹{receipt?.data?.cgstAmount ?? "0"}
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
                    ₹{receipt?.data?.sgstAmount ?? "0"}
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
                    IGST
                  </td>
                  <td
                    style={{
                      padding: "3px 8px",
                      borderBottom: "1px solid #d1d5db",
                      textAlign: "right",
                    }}
                  >
                    ₹{receipt?.data?.igstAmount ?? "0"}
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
                    ₹{receipt?.data?.discount ?? "0"}
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
                    ₹{receipt?.data?.grandTotal ?? "0"}
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
              {converter.convert(receipt?.data?.grandTotal ?? 0, {
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

export default PurchaseInvoice;
