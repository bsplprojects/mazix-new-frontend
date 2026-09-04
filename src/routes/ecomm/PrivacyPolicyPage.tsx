import Footer from "@/components/Footer";
import Header from "@/components/Header";

const PrivacyPolicyPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8 text-center">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">
                Information Collection
              </h2>
              <p className="text-muted-foreground">
                We collect personal information when you register on our site,
                place an order, subscribe to our newsletter, or fill out a form.
                The information collected may include your name, email address,
                mailing address, phone number, and payment information.
              </p>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">
                Use of Information
              </h2>
              <p className="text-muted-foreground">
                The information we collect is used to process transactions,
                improve our website, send periodic emails regarding your order
                or other products and services, and to personalize your
                experience.
              </p>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
              <p className="text-muted-foreground">
                We use cookies to understand and save your preferences for
                future visits, compile aggregate data about site traffic and
                interaction, and provide better site experiences.
              </p>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">Confidentiality</h2>
              <p className="text-muted-foreground">
                All affiliates and distributors are required to maintain strict
                confidentiality of any proprietary or personal information they
                receive as part of their association with Mazix.
              </p>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions regarding this privacy policy, you may
                contact us at info@mazix.co.in
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
