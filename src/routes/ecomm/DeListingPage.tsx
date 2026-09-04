import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { XCircle } from "lucide-react";

const DeListingPage = () => {
  const grounds = [
    "Violation of the Code of Conduct",
    "Engaging in fraudulent activities or misrepresentation",
    "Non-compliance with company policies and procedures",
    "Failure to maintain minimum purchase requirements",
    "Involvement in illegal activities",
    "Breach of confidentiality agreements",
    "Spreading false information about the company or products",
    "Harassment of other distributors or customers",
    "Operating unauthorized websites or social media accounts",
    "Cross-recruiting or soliciting distributors from other companies",
    "Selling products through unauthorized channels",
    "Failure to renew distributor agreement",
    "Inactivity for a continuous period of two years",
    "Causing harm to the company's reputation",
    "Any other grounds as determined by the company"
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">De-Listing Direct Seller</h1>
            <p className="text-muted-foreground">
              Grounds for termination of distributorship with MMPL
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-xl border border-border">
            <h2 className="text-2xl font-semibold mb-6">Grounds for Termination</h2>
            <ol className="space-y-4">
              {grounds.map((ground, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="flex-shrink-0 w-6 h-6 bg-destructive/10 text-destructive rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span>{ground}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-accent/30 p-8 rounded-xl mt-8">
            <h2 className="text-2xl font-semibold mb-4">Appeal Process</h2>
            <p className="text-muted-foreground">
              Distributors who have been de-listed may appeal the decision by submitting a written request to the company within 30 days of receiving the termination notice. The appeal will be reviewed by the management committee and a final decision will be communicated within 15 working days.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DeListingPage;
