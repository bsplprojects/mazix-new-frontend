import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { teamApi } from "@/services/teamApi";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function PayoutStatement() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const ref = useRef<HTMLDivElement>(null);

  const { isLoading } = useQuery({
    queryKey: ["statement", id],
    queryFn: async () => {
      const res = await teamApi.statement(id as string);
      setData(res?.[0] || null);
      return res.data;
    },
    enabled: !!id,
  });

  const printPage = () => {
    const html = ref.current?.innerHTML;

    if (html) {
      const printWindow = window.open("", "_blank");
      printWindow?.document.write(html);
      printWindow?.document.close();
      printWindow?.print();
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <main className="md:w-4xl mx-auto">
      <div style={{ textAlign: "center", margin: "24px 0px" }}>
        <Button onClick={printPage}>Print Statement</Button>
      </div>
      <div
        ref={ref}
        style={{
          background: "#fff",
          color: "#000",
          maxWidth: "89xpx",
          marginInline: "auto",
          padding: "24px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            borderBottom: "1px solid #ccc",
            paddingBottom: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              Meghdoot Marketing Pvt. Ltd.
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "#4a5565",
              }}
            >
              Email: rkrajpragati6@gmail.com <br />
              Address: Kokar Chunna Bhatta, H.B Road Kokar,
              Ranchi-834001[Jharkhand]
            </p>
          </div>

          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                color: "#364153",
              }}
            >
              STATEMENT
            </h2>
          </div>
        </div>

        {/* TOP INFO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            marginTop: "24px",
            fontSize: "14px",
          }}
        >
          {/* LEFT */}
          <div>
            <p>
              <b>Member ID:</b> {data?.MemberID}
            </p>
            <p>
              <b>Member Name:</b> {data?.MemberName}
            </p>
          </div>

          {/* RIGHT */}
          <div>
            <p>
              <b>From:</b>{" "}
              {new Date(data?.PayoutFromDate).toLocaleDateString("en-IN")}
            </p>
            <p>
              <b>To:</b>{" "}
              {new Date(data?.PayoutToDate).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: "24px",
            border: "1px solid #ccc",
            borderRadius: "0.25rem",
            overflow: "hidden",
          }}
        >
          <h3
            style={{
              fontWeight: 600,
              padding: "0.75rem",
              background: "#f3f4f6",
              borderBottom: "1px solid #ccc",
            }}
          >
            Binary Details
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              fontSize: "14px",
            }}
          >
            {/* LEFT */}
            <div
              style={{
                padding: "16px",
                borderRight: "1px solid #ccc",
              }}
            >
              <p style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Current ORG 1</span> <b>{data?.CurrentLeft}</b>
              </p>

              <p style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Old ORG 1</span> <b>{data?.OldLeftCarry}</b>
              </p>

              <p style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Repurchase ORG 1</span> <b>{data?.PurCurrentLeft}</b>
              </p>
            </div>

            {/* RIGHT */}
            <div
              style={{
                padding: "16px",
              }}
            >
              <p style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Current ORG 2</span> <b>{data?.CurrentRight}</b>
              </p>

              <p style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Old ORG 2</span> <b>{data?.OldRightCarry}</b>
              </p>

              <p style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Repurchase ORG 2</span> <b>{data?.PurCurrentRight}</b>
              </p>
            </div>
          </div>
        </div>

        {/* Income Summary */}
        <div
          style={{
            marginTop: "24px",

            gap: "24px",
          }}
        >
          {/* SUMMARY */}
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "0.25rem",
              padding: "20px",
              background: "#f9fafb",
            }}
          >
            <h3
              style={{
                fontWeight: "600",
                marginBottom: "16px",
                color: "#364153",
              }}
            >
              Income Summary
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                fontSize: "14px",
                gap: "16px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#6a7282",
                  }}
                >
                  Matching
                </p>
                <p style={{ fontWeight: "700" }}>{data?.Pair}</p>
              </div>
              <div>
                <p
                  style={{
                    color: " #6a7282",
                  }}
                >
                  Total Income
                </p>
                <p
                  style={{
                    color: "#0077B6",
                    fontWeight: "700",
                  }}
                >
                  ₹ {data?.Amount}
                </p>
              </div>

              <div>
                <p style={{ color: "#6a7282" }}>Bonus</p>
                <p
                  style={{
                    fontWeight: "700",
                    color: "#9810fa",
                  }}
                >
                  {data?.Bonus}
                </p>
              </div>

              <div>
                <p
                  style={{
                    color: " #6a7282",
                  }}
                >
                  TDS
                </p>
                <p
                  style={{
                    fontWeight: "700",
                    color: "#fb2c36",
                  }}
                >
                  ₹ {data?.TDS}
                </p>
              </div>
              <div>
                <p
                  style={{
                    color: "#6a7282",
                  }}
                >
                  Processing Charge
                </p>
                <p style={{ fontWeight: "700" }}>{data?.AdminCharge}</p>
              </div>

              <div>
                <p
                  style={{
                    color: "#6a7282",
                  }}
                >
                  Voucher
                </p>
                <p style={{ fontWeight: "700" }}>{data?.Vouchur}</p>
              </div>

              <div>
                <p
                  style={{
                    color: " #6a7282",
                  }}
                >
                  Net Payable
                </p>
                <p
                  style={{
                    fontWeight: "700",
                    color: "#00a63e",
                  }}
                >
                  ₹ {Number(data?.Payable) + Number(data?.Bonus)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            fontSize: "12px",
            color: "#6a7282",
          }}
        >
          Thank you for your business
        </div>

        {/* PRINT BUTTON */}
      </div>
    </main>
  );
}
