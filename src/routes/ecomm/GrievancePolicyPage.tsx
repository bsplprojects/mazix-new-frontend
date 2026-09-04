import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Shield, Phone, Mail } from "lucide-react";

const GrievancePolicyPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
              Grievance and Nodal Officer Policy
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-card p-8 rounded-xl border border-border mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Grievance Redressal Mechanism
              </h2>
              <p className="text-muted-foreground mb-4">
                Meghdoot Marketing Pvt. Ltd. (MMPL) is committed to providing
                excellent customer service and addressing all grievances in a
                timely and fair manner.
              </p>
              <p className="text-muted-foreground">
                Any customer or distributor with a complaint can reach out to
                our Grievance Officer through the following channels:
              </p>
            </div>

            <div className="bg-accent/30 p-8 rounded-xl mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Nodal Officer Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>+91 9955613671</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>info@mazix.co.in</span>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">
                Grievance Resolution Process
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>1. Submit your grievance via email or phone</li>
                <li>2. Receive acknowledgment within 24 hours</li>
                <li>3. Investigation and resolution within 15 working days</li>
                <li>4. If not satisfied, escalate to senior management</li>
                <li>5. Final resolution communicated in writing</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default GrievancePolicyPage;
