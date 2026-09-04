import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Shield, CheckCircle } from "lucide-react";

const CertifiedPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
              Website Certified by CS
            </h1>
            <p className="text-muted-foreground">
              Certified for compliance with Direct Selling Guidelines
            </p>
          </div>

          <div className="bg-card p-8 rounded-xl border border-border mb-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-semibold">Certification Details</h2>
            </div>

            <div className="space-y-6 text-muted-foreground">
              <p>
                This website of MEGHDOOT MARKETING PVT. LTD. has been certified
                by a practicing Company Secretary (CS) for compliance with the
                following:
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <span>Consumer Protection (Direct Selling) Rules, 2021</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <span>
                    Consumer Protection (Direct Selling) Amendment Rules, 2023
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <span>Companies Act, 2013</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <span>Information Technology Act, 2000</span>
                </li>
              </ul>

              <div className="bg-accent/30 p-6 rounded-lg mt-8">
                <h3 className="font-semibold text-foreground mb-2">
                  Certification Validity
                </h3>
                <p>
                  The certification is subject to periodic review and renewal as
                  per regulatory requirements. The company maintains all
                  necessary documentation for verification purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CertifiedPage;
