import Footer from "@/components/Footer";
import Header from "@/components/Header";

const TermsAndCondition = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background py-24">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-10">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8 text-center">
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Last Updated:{" "}
            <span className="font-medium">
              8<sup>th</sup> January 2026
            </span>
          </p>

          <p className="text-gray-700 mb-6">
            Welcome to <strong>Meghdoot Marketing Pvt. Ltd. (MMPL)</strong>. By
            accessing or using our website, products, or services, you agree to
            comply with and be bound by the following Terms and Conditions.
          </p>

          {/* Section */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700">
              By using our services, you confirm that you have read, understood,
              and agree to be bound by these Terms. If you do not agree, you
              must discontinue use of our services immediately.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              2. About the Company
            </h2>
            <p className="text-gray-700">
              Meghdoot Marketing Pvt. Ltd. is a company registered under the
              Companies Act, 2013, India, engaged in marketing, advertising, and
              promotional services.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              3. Use of Services
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Use services only for lawful purposes</li>
              <li>Do not misuse or attempt unauthorized access</li>
              <li>Do not violate any applicable laws or regulations</li>
              <li>Do not infringe on third-party rights</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              4. Intellectual Property
            </h2>
            <p className="text-gray-700">
              All content including text, graphics, logos, designs, and software
              is the exclusive property of Meghdoot Marketing Pvt. Ltd. and is
              protected by applicable intellectual property laws.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              5. Payments & Refunds
            </h2>
            <p className="text-gray-700">
              All payments made for services are non-refundable unless
              explicitly stated otherwise in writing. Prices may change without
              prior notice.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700">
              Meghdoot Marketing Pvt. Ltd. shall not be liable for any indirect,
              incidental, special, or consequential damages arising from the use
              or inability to use our services.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              7. Third-Party Links
            </h2>
            <p className="text-gray-700">
              Our website may contain links to third-party websites. We are not
              responsible for the content, privacy policies, or practices of
              such websites.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              8. Termination
            </h2>
            <p className="text-gray-700">
              We reserve the right to suspend or terminate access to our
              services at any time without notice if these Terms are violated.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              9. Governing Law
            </h2>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with
              the laws of India. Courts in India shall have exclusive
              jurisdiction.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              10. Contact Information
            </h2>
            <p className="text-gray-700">
              <strong>Meghdoot Marketing Pvt. Ltd. (MMPL)</strong>
              <br />
              Email: info@mazix.co.in
              <br />
              Phone: (+91) 9955613671
              <br />
              Address: HB Road, Chunna Bhatta, Kokar, Ranchi, Jharkhand
            </p>
          </section>

          <div className="border-t pt-4 mt-6 text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Meghdoot Marketing Pvt. Ltd. All rights
            reserved.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsAndCondition;
