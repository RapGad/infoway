"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Wifi, Code, Headset, ChevronDown, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const faqs = [
  {
    question: "Do you offer coverage in my village?",
    answer: "We cover Duayaw Nkwanta and are rapidly expanding to surrounding communities in the Ahafo Region. Please contact us with your exact location for a coverage check."
  },
  {
    question: "How do the internet vouchers work?",
    answer: "You can purchase physical vouchers from local vendors or buy them digitally via mobile money. Simply enter the code on our portal to get instant access."
  },
  {
    question: "What kind of software do you build?",
    answer: "We specialise in web applications, mobile apps, management dashboards, and e-commerce platforms tailored for local businesses, schools, and healthcare facilities."
  },
  {
    question: "How much does the internet cost?",
    answer: "We offer free ad-supported light plans for essential access, and premium unlimited data packages starting at very affordable daily, weekly, or monthly rates."
  }
];

export default function Services() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Page Header */}
      <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FF6B00" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-heading font-bold mb-6"
          >
            Technology That Reaches <span className="text-primary">Every Village.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            From permanent digital infrastructure to custom software solutions, we are building the future of the Ahafo Region.
          </motion.p>
        </div>
      </section>

      {/* 1. Rural Internet */}
      <section id="internet" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light text-primary rounded-full font-bold mb-6">
                <Wifi className="w-5 h-5" /> Rural Internet
              </div>
              <motion.h2 variants={fadeIn} className="text-4xl font-heading font-bold mb-6 text-gray-900">
                Wi-Fi hotspots built to last.
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-gray-600 mb-8 leading-relaxed">
                We deploy permanent wireless and fibre-based networks that give entire communities affordable, fast internet. Choose from ad-supported light plans or premium unlimited access.
              </motion.p>
              
              <motion.ul variants={fadeIn} className="space-y-4 mb-8">
                {['Voucher system for easy top-ups', 'Local content cache (Wikipedia, videos, apps)', 'Community chat and local forums'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-800 font-medium">
                    <CheckCircle className="w-5 h-5 text-primary" /> {feature}
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={fadeIn}>
                <Link href="/contact?service=internet" className="inline-flex items-center px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors transform hover:scale-105">
                  Bring Internet to Your Area
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="bg-gray-100 rounded-[2rem] h-[500px] relative overflow-hidden"
            >
              <img src="/rural_tech.png" alt="Rural Wi-Fi Installation" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Software Development */}
      <section id="software" className="py-24 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-row-reverse">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="bg-gray-800 rounded-[2rem] h-[500px] relative overflow-hidden order-2 lg:order-1"
            >
               {/* Decorative Code Elements */}
               <div className="absolute top-4 left-4 right-4 flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
               </div>
               <div className="pt-12 px-6 text-green-400 font-mono text-sm opacity-50">
                 <p>{`const techStack = [`}</p>
                 <p className="pl-4">{`'JavaScript', 'Node.js',`}</p>
                 <p className="pl-4">{`'React', 'Next.js',`}</p>
                 <p className="pl-4">{`'TailwindCSS', 'PostgreSQL'`}</p>
                 <p>{`];`}</p>
                 <br />
                 <p>{`async function buildFuture() {`}</p>
                 <p className="pl-4">{`return await Infoway.createApp();`}</p>
                 <p>{`}`}</p>
               </div>
               <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium z-10 pointer-events-none">
                 [Software Dashboard Mockup]
               </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full font-bold mb-6">
                <Code className="w-5 h-5" /> Software Development
              </div>
              <motion.h2 variants={fadeIn} className="text-4xl font-heading font-bold mb-6 text-gray-900">
                Digital tools for local growth.
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-gray-600 mb-8 leading-relaxed">
                We build custom web and mobile applications, management dashboards, and e-commerce solutions specifically designed for the unique needs of Ghanaian businesses.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-wrap gap-2 mb-8">
                {['JavaScript', 'Node.js', 'React', 'Next.js', 'PostgreSQL'].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600">{tech}</span>
                ))}
              </motion.div>

              <motion.div variants={fadeIn} className="flex gap-4">
                <Link href="/contact?service=software" className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition-colors transform hover:scale-105">
                  Start Your Project
                </Link>
                <Link href="/portfolio" className="inline-flex items-center px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 font-bold rounded-full hover:bg-gray-50 transition-colors transform hover:scale-105">
                  View Portfolio
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Other Tech Services */}
      <section id="support" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light text-primary rounded-full font-bold mb-6">
              <Headset className="w-5 h-5" /> IT Consulting & Support
            </div>
            <h2 className="text-4xl font-heading font-bold mb-4 text-gray-900">Comprehensive Tech Solutions</h2>
            <p className="text-xl text-gray-600">Beyond internet and software, we provide the backbone for digital operations in Ahafo.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Network Design", desc: "Professional planning and deployment of corporate and campus networks." },
              { title: "Point-to-Point Links", desc: "Long-range wireless links connecting distant offices or farms seamlessly." },
              { title: "Digital Literacy", desc: "Training programs to ensure your team or community can maximise technology." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Got questions? We've got answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button 
                  className="w-full px-6 py-4 text-left flex justify-between items-center font-bold text-gray-900 focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {faq.question}
                  <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
