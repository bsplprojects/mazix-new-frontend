import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CheckCircle } from "lucide-react";

const SelfDeclarationPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8 text-center">
            Self Declaration
          </h1>

          <div className="bg-card p-8 rounded-xl border border-border mb-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-semibold">Compliance Declaration</h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
              <p>
                The team of <strong>MEGHDOOT MARKETING PVT. LTD. (MMPL)</strong>{" "}
                firmly declares that the company is compliant with the
                following:
              </p>

              <div className="bg-accent/30 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  No Pyramid Scheme
                </h3>
                <p>
                  The company does not promote a Pyramid Scheme, as defined in
                  the Consumer Protection (Direct Selling) Rules, 2021. Or
                  enroll any person in such a scheme or participate in such an
                  arrangement in any manner whatsoever in the guise of doing
                  Direct Selling business.
                </p>
              </div>

              <div className="bg-accent/30 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  No Money Circulation Scheme
                </h3>
                <p>
                  MEGHDOOT MARKETING PVT. LTD. also does not participate in a
                  Money Circulation Scheme, as defined in Consumer Protection
                  (Direct Selling) Rules, 2021 & Consumer Protection (Direct
                  Selling) Amendment Rules, 2023, in the guise of Direct Selling
                  of Business Opportunities.
                </p>
              </div>

              <div className="bg-accent/30 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">
                  Full Compliance
                </h3>
                <p>
                  The company is also compliant with all the remaining aspects
                  mentioned in the Consumer Protection (Direct Selling) Rules,
                  2021, & Consumer Protection (Direct Selling) Amendment Rules,
                  2023, by the Department of Consumer Affairs, Ministry of
                  Consumer Affairs, Food and Public Distribution and shall also
                  provide such details as may be notified from time to time.
                </p>
              </div>

              <p className="font-semibold text-foreground text-center mt-8">
                Team of
                <br />
                MEGHDOOT MARKETING PVT. LTD.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SelfDeclarationPage;
