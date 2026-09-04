import Footer from "@/components/Footer";
import Header from "@/components/Header";


const DisclaimerPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8 text-center">Disclaimer</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">Website Terms of Use</h2>
              <p className="text-muted-foreground">
                Access to and use of the Mazix website and the information, materials, products and services available through the Mazix Website are subject to these terms of use.
              </p>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground">
                All Rights Reserved. The Mazix Website and materials made available on the Website are protected by intellectual property rights, including copyrights and trademarks. The names "Mazix", "Nourish", "Nurture", "Naturals" etc. are owned by Mazix or used by Mazix under license.
              </p>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">Website Disclaimer</h2>
              <p className="text-muted-foreground">
                Our company does not engage in any kind of financial investment, float any investment scheme, or chit fund entrepreneurship. Our company is engaged in the marketing and sales of goods using word of mouth, publicity, display, or demonstration of goods/products.
              </p>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">Income Disclaimer</h2>
              <p className="text-muted-foreground">
                The Sales & Marketing Plan shared on the company's website is the only Income Earning Opportunity that is followed by the company. The company does not provide any assurance or promise of income based on the product purchases made by respective customers. Distributors will be eligible for income depending on the business done by him/her.
              </p>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">Product Disclaimer</h2>
              <p className="text-muted-foreground">
                The buyer shall be solely responsible for all consequences for the purchase and use of products bought from unauthorized sources including unauthorized websites, E-commerce marketplace or unauthorized party.
              </p>
            </section>

            <section className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl font-semibold mb-4">Jurisdiction</h2>
              <p className="text-muted-foreground">
                The use of the Mazix Website and these Website Terms of Use are governed by the laws of Republic of India. The courts of Ranchi have exclusive jurisdiction for any disputes. Any breach of this disclaimer would entail severe civil and criminal penalties.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DisclaimerPage;
