import { FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import PanCard from "@/assets/Mazix_PanCard1.jpg";
import IncomeTax from "@/assets/income-tax.pdf";
import GSTReturn from "@/assets/Goods-and-service-tax-return.pdf";
import tanDetails from "@/assets/tan-details.pdf";
import directorDetails from "@/assets/Director-Detail.pdf";
import meghAOA from "@/assets/Megh-AOA.pdf";
import meghMOA from "@/assets/Megh-MOA.pdf";
import regCertificate from "@/assets/REGISTRATION-CERTIFICATE-1.jpg";
import COI from "@/assets/LEGAL-CERTIFICATECertificate.jpg";
import COR from "@/assets/Certificate-of-registration.jpg";
import COC from "@/assets/Certificate-of-compliance.jpg";
import TMCertificate from "@/assets/TM-CLASS-35-MEGHDOOT.pdf";
import ReturnAndExhange from "@/assets/RETURN-REFUND-AND-EXCHANGE-POLICY.pdf";
import BankDetails from "@/assets/banking.jpg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LegalPage = () => {
  const documents = [
    {
      title: "Articles of Association",
      description: "Company's rules and regulations",
      file: meghAOA,
    },
    {
      title: "Memorandum of Association",
      description: "Company's constitution and objectives",
      file: meghMOA,
    },
    {
      title: "DIN No. of Directors",
      description: "Director Identification Numbers",
      file: directorDetails,
    },
    {
      title: "TAN Details",
      description: "Tax Deduction Account Number",
      file: tanDetails,
    },
    {
      title: "PAN Card",
      description: "Permanent Account Number",
      file: PanCard,
    },
    {
      title: "GST Registration",
      description: "Goods and Service Tax Registration",
      file: regCertificate,
    },
    {
      title: "Goods and Service Tax Return",
      description: "GST filing records",
      file: GSTReturn,
    },
    {
      title: "Income Tax Return",
      description: "ITR filing documents",
      file: IncomeTax,
    },
    {
      title: "Trade Mark Certificate",
      description: "Registered trademark certificates",
      file: TMCertificate,
    },
    {
      title: "Return, Exchange and Refund policy",
      description: "Return, Exchange and Refund policy document",
      file: ReturnAndExhange,
    },
    {
      title: "Certificate of Incorporation",
      description: "Certificate of Incorporation",
      file: COI,
    },
    {
      title: "Certificate of Registration",
      description: "Certificate of Registration",
      file: COR,
    },
    {
      title: "Certificate of Compliance",
      description: "Certificate of Compliance",
      file: COC,
    },
    {
      title: "Bank Details",
      description: "Bank account details",
      file: BankDetails,
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
              Legal Documents
            </h1>
            <p className="text-muted-foreground">
              Official legal certificates and registration documents of MEGHDOOT
              MARKETING PVT. LTD.
            </p>
          </div>

          <div className="grid gap-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl border border-border flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{doc.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {doc.description}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(doc.file, "_blank")}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-accent/30 p-8 rounded-xl mt-8 text-center">
            <p className="text-muted-foreground">
              For any queries regarding legal documents, please contact us at
              info@mazix.co.in
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LegalPage;
