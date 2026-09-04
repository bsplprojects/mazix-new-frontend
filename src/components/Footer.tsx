import { Phone, Mail, MapPin, ArrowRight, AxeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.png";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Sales & Marketing Strategy", href: "/sales-marketing" },
    { label: "Recognition & Reward", href: "/recognition-reward" },
    { label: "Top 10 Achievers", href: "/top-achievers" },
    { label: "Products", href: "/products" },
    { label: "Grievance and Nodal Officer Policy", href: "/grievance-policy" },
  ];

  const supportLinks = [
    // { label: "Login", href: "https://new.mazix.co.in" },
    // { label: "Register", href: "/register" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Terms and Conditions", href: "/terms-conditions" },
    { label: "Self Declaration", href: "/self-declaration" },
    { label: "De-Listing Direct Seller", href: "/de-listing" },
    { label: "Legal", href: "/legal" },
    { label: "Website Certified by CS", href: "/certified" },
  ];

  const socialLinks = [
    {
      icon: AxeIcon,
      href: "https://www.facebook.com/Megdootmarketing/",
      label: "Facebook",
    },
    {
      icon: AxeIcon,
      href: "https://www.instagram.com/meghdoot_marketing_pvt_lvt",
      label: "Instagram",
    },
    // { icon: Twitter, href: "#", label: "Twitter" },
    // { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-accent text-accent-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div>
                <img src={Logo} className="h-20 w-55 text-accent-foreground" />
              </div>
              {/* <span className="text-2xl font-serif font-bold">Mazix</span> */}
            </Link>
            <p className="text-accent-foreground/70 mb-6 leading-relaxed">
              Your trusted destination for premium herbal products.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-accent-foreground/80">
                <Phone className="h-5 w-5" />
                <span>(+91) 9955613671</span>
              </div>
              <div className="flex items-center gap-3 text-accent-foreground/80">
                <Mail className="h-5 w-5" />
                <span>info@mazix.co.in</span>
              </div>
              <div className="flex items-center gap-3 text-accent-foreground/80">
                <MapPin className="h-5 w-5" />
                <span>Ranchi, Jharkhand</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-5">
              Quick Links
            </h4>
            <div className="w-12 h-1 bg-primary mb-5"></div>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-accent-foreground/70 hover:text-accent-foreground transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h4 className="font-serif font-semibold text-lg mb-5">Support</h4>
            <div className="w-12 h-1 bg-primary mb-5"></div>
            <div className="flex flex-wrap gap-3">
              <a
                href={"https://new.mazix.co.in"}
                target="_blank"
                className="px-4 py-2 border border-accent-foreground/20 rounded-md text-accent-foreground/70 hover:text-accent-foreground hover:border-accent-foreground/40 transition-colors text-sm"
              >
                Login
              </a>
              {supportLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-4 py-2 border border-accent-foreground/20 rounded-md text-accent-foreground/70 hover:text-accent-foreground hover:border-accent-foreground/40 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Language Selector */}
        {/* <div className="py-6 border-t border-accent-foreground/10">
          <div className="flex items-center justify-center gap-3">
            <span className="text-accent-foreground/70 text-sm">
              Translate:
            </span>
            <LanguageSelector />
          </div>
        </div> */}

        <div className="pt-8 border-t border-accent-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-accent-foreground/60 text-sm">
              © {new Date().getFullYear()} Mazix (Meghdoot Marketing Pvt. Ltd.).
              All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                  className="p-2 rounded-full bg-accent-foreground/10 text-accent-foreground/70 hover:bg-accent-foreground/20 hover:text-accent-foreground transition-all"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
