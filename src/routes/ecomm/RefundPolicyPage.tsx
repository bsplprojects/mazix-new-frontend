import Footer from "@/components/Footer";
import Header from "@/components/Header";

const RefundPolicyPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8 text-center">
            Refund Policy
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">
                Return Eligibility
              </h2>
              <p className="text-muted-foreground">
                Products can be returned within 7 days of delivery if they are
                unused, in original packaging, and with all tags intact.
                Perishable goods and health supplements cannot be returned once
                opened.
              </p>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  1. Contact our customer service within 7 days of delivery
                </li>
                <li>2. Provide order number and reason for return</li>
                <li>3. Ship the product back to our warehouse</li>
                <li>
                  4. Refund will be processed within 7-10 business days after
                  receiving the product
                </li>
              </ul>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">
                Non-Refundable Items
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Opened health supplements and consumables</li>
                <li>• Products with broken seals</li>
                <li>• Items purchased on sale or with discounts</li>
                <li>• Shipping charges (unless product was defective)</li>
              </ul>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">
                Damaged or Defective Products
              </h2>
              <p className="text-muted-foreground">
                If you receive a damaged or defective product, please contact us
                within 48 hours of delivery with photos of the damage. We will
                arrange for a replacement or full refund including shipping
                charges.
              </p>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">
                Contact for Refunds
              </h2>
              <p className="text-muted-foreground">
                For refund queries, email us at info@mazix.co.in or call +91
                9955613671
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RefundPolicyPage;
