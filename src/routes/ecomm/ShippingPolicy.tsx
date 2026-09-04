import Footer from "@/components/Footer";
import Header from "@/components/Header";

const ShippingPolicy = () => {
  return (
    <>
      {" "}
      <Header />
      <main className="min-h-screen bg-background py-24">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-10">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8 text-center">
            Shipping Policy
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Last Updated:{" "}
            <span className="font-medium">
              8<sup>th</sup> January 2026
            </span>
          </p>

          <p className="text-gray-700 mb-6">
            This Shipping Policy outlines the shipping and delivery terms for
            products and services offered by{" "}
            <strong>Meghdoot Marketing Pvt. Ltd. (MMPL)</strong>. By placing an
            order with us, you agree to the terms mentioned below.
          </p>

          {/* Section */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              1. Shipping Coverage
            </h2>
            <p className="text-gray-700">
              We currently ship products across India. International shipping,
              if available, will be clearly mentioned at the time of order
              placement.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              2. Order Processing Time
            </h2>
            <p className="text-gray-700">
              Orders are typically processed within{" "}
              <strong>1–3 business days</strong> after successful payment
              confirmation. Processing times may vary during peak seasons,
              holidays, or due to unforeseen circumstances.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              3. Shipping Time & Delivery
            </h2>
            <p className="text-gray-700">
              Estimated delivery timelines depend on your location and the
              courier partner:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
              <li>Metro Cities: 3–5 business days</li>
              <li>Non-Metro Cities: 5–7 business days</li>
              <li>Remote Areas: 7–10 business days</li>
            </ul>
            <p className="text-gray-700 mt-2">
              Delivery timelines are estimates and may vary due to external
              factors beyond our control.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              4. Shipping Charges
            </h2>
            <p className="text-gray-700">
              Shipping charges, if applicable, will be displayed at checkout
              before payment. The Company reserves the right to revise shipping
              fees at any time without prior notice.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              5. Order Tracking
            </h2>
            <p className="text-gray-700">
              Once your order is shipped, tracking details will be shared via
              email or SMS, where applicable. Customers are responsible for
              tracking their shipments using the provided information.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              6. Delayed or Failed Delivery
            </h2>
            <p className="text-gray-700">
              Meghdoot Marketing Pvt. Ltd. shall not be held responsible for
              delivery delays caused by courier partners, natural calamities,
              incorrect address details, or force majeure events.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              7. Damaged or Missing Items
            </h2>
            <p className="text-gray-700">
              If you receive a damaged package or missing items, please notify
              us within <strong>48 hours</strong> of delivery along with
              relevant images or proof. Claims raised after this period may not
              be entertained.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              8. Address Accuracy
            </h2>
            <p className="text-gray-700">
              Customers are responsible for providing accurate shipping details.
              Orders returned due to incorrect or incomplete addresses may incur
              additional shipping charges.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              9. Policy Changes
            </h2>
            <p className="text-gray-700">
              We reserve the right to update or modify this Shipping Policy at
              any time without prior notice. Changes will be effective
              immediately upon posting.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              10. Contact Us
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

export default ShippingPolicy;
