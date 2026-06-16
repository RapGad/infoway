import Link from "next/link";
import { Globe, MessageCircle, Users, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Call to Action pre-footer area */}
        <div className="bg-primary rounded-3xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden">
          {/* Subtle background motif */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">Ready to bring your community online?</h2>
            <p className="text-white/80 text-lg">Join the thousands already connected with Infoway's reliable network.</p>
          </div>
          <div className="relative z-10">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors group"
            >
              Contact Us
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
          {/* Brand Col */}
          <div>
            <Link href="/" className="font-heading font-bold text-2xl tracking-tight text-white mb-6 inline-block">
              Infoway<span className="text-primary">.</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Building Digital Futures from the Heart of Ahafo. Fast, reliable internet and smart software designed for communities that others overlook.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors" aria-label="Facebook">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors" aria-label="Twitter">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors" aria-label="LinkedIn">
                <Users className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">Software Portfolio</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Latest News</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-4">
              <li><Link href="/services#internet" className="text-gray-400 hover:text-white transition-colors">Rural Internet</Link></li>
              <li><Link href="/services#software" className="text-gray-400 hover:text-white transition-colors">Custom Software</Link></li>
              <li><Link href="/services#support" className="text-gray-400 hover:text-white transition-colors">Tech Support</Link></li>
              <li><Link href="/services#consulting" className="text-gray-400 hover:text-white transition-colors">IT Consulting</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div itemScope itemType="https://schema.org/LocalBusiness">
            <meta itemProp="name" content="Infoway" />
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <span itemProp="streetAddress">Main Tech Hub, near the central market</span><br />
                  <span itemProp="addressLocality">Duayaw Nkwanta</span>, <span itemProp="addressRegion">Ahafo Region</span><br />
                  <span itemProp="addressCountry">Ghana</span>
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+233000000000" className="hover:text-white transition-colors" itemProp="telephone">+233 (0) 000 000 000</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:hello@infoway.com.gh" className="hover:text-white transition-colors" itemProp="email">hello@infoway.com.gh</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Infoway. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
