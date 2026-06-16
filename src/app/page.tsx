"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Wifi, Code, Headset, CheckCircle, ArrowRight, Star } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
        {/* Animated Background Connectivity Motif */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <svg className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] opacity-10 animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="40" stroke="#FF6B00" strokeWidth="0.5" fill="none" strokeDasharray="2 4" />
            <circle cx="50" cy="50" r="30" stroke="#FF6B00" strokeWidth="0.5" fill="none" strokeDasharray="4 8" />
            <circle cx="50" cy="50" r="20" stroke="#FF6B00" strokeWidth="1" fill="none" strokeDasharray="6 12" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.span variants={fadeIn} className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block">
                Welcome to Infoway
              </motion.span>
              <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6 text-gray-900">
                Building Digital Futures <span className="text-primary">Nationwide.</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                Infoway delivers fast, reliable internet and smart software — designed for communities that others overlook.
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <Link href="/services" className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors text-center transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/30">
                  Explore Our Services
                </Link>
                <Link href="/contact" className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-50 border-2 border-gray-100 transition-colors text-center transform hover:scale-105 active:scale-95">
                  Get Connected
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Hero Image / Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block h-[600px]"
            >
              <div className="absolute inset-0 bg-accent-light rounded-[3rem] transform rotate-3"></div>
              <div className="absolute inset-0 bg-gray-900 rounded-[3rem] transform -rotate-2 overflow-hidden shadow-2xl">
                <img src="/hero_landscape.png" alt="Duayaw Nkwanta Digital Connectivity" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Services Overview */}
      <section className="py-24 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-heading font-bold mb-4">Technology That Reaches Every Village.</h2>
            <p className="text-xl text-gray-600">We bridge the digital divide with permanent infrastructure and tailored software solutions.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeIn}
              className="group bg-accent-light p-8 rounded-3xl hover:bg-primary transition-colors duration-300 relative overflow-hidden"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:text-primary-dark shadow-sm">
                <Wifi className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-white">Rural Internet</h3>
              <p className="text-gray-600 mb-6 group-hover:text-white/90">Wi-Fi hotspots and permanent networks built to last. Affordable, fast internet for everyone.</p>
              <Link href="/services" className="inline-flex items-center font-bold text-primary group-hover:text-white">
                Learn more <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              {/* Hover effect wave */}
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </motion.div>

            {/* Service 2 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeIn}
              className="group bg-gray-50 p-8 rounded-3xl hover:bg-gray-900 transition-colors duration-300"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-gray-900 shadow-sm">
                <Code className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-white">Custom Software</h3>
              <p className="text-gray-600 mb-6 group-hover:text-gray-300">Web & mobile apps, management dashboards, and e-commerce solutions for African businesses.</p>
              <Link href="/services" className="inline-flex items-center font-bold text-gray-900 group-hover:text-white">
                View projects <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Service 3 */}
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeIn}
              className="group bg-gray-50 p-8 rounded-3xl hover:bg-gray-900 transition-colors duration-300"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-gray-900 shadow-sm">
                <Headset className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-white">Tech Support & Consulting</h3>
              <p className="text-gray-600 mb-6 group-hover:text-gray-300">Guiding your digital journey with network design, IT consulting, and digital literacy training.</p>
              <Link href="/services" className="inline-flex items-center font-bold text-gray-900 group-hover:text-white">
                Get support <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        {/* SVG background wave */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
            <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
            </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">Connecting is Simple.</h2>
            <p className="text-xl text-gray-400">Three easy steps to get your community online.</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gray-800 -translate-y-1/2 z-0">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="h-full bg-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                { step: "1", title: "We build the network", desc: "Our team installs robust towers and fibre links." },
                { step: "2", title: "You connect any device", desc: "Log on with your smartphone, tablet, or PC." },
                { step: "3", title: "Enjoy local speed", desc: "Experience fast, reliable access to the world." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.3 }}
                  viewport={{ once: true }}
                  className="bg-gray-800 p-8 rounded-3xl text-center border border-gray-700 relative"
                >
                  <div className="w-16 h-16 bg-primary text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,107,0,0.3)]">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Infoway */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            >
              <h2 className="text-4xl font-heading font-bold mb-6">Why Choose Infoway?</h2>
              <p className="text-xl text-gray-600 mb-8">We are deeply rooted in Ghana, understanding the unique challenges and opportunities of our communities nationwide.</p>
              
              <ul className="space-y-6">
                {[
                  { title: "Locally Owned & Operated", desc: "We live here, we work here, and we care about our region's growth." },
                  { title: "Affordable Plans", desc: "Ad-supported light plans and premium unlimited access to fit every budget." },
                  { title: "Local Content Caching", desc: "Instant access to educational resources like Wikipedia and local apps." },
                ].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1 mr-4" />
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{feature.title}</h4>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-[2rem] overflow-hidden bg-gray-100"
            >
              {/* Local Team Image */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-200">
                <img src="/team_meeting.png" alt="Infoway Local Tech Team" className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-accent-light relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">Voices from Our Clients</h2>
            <p className="text-xl text-gray-600">Hear what our users have to say.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Infoway transformed our school. The students now have access to learning materials they never had before.", author: "Kwame A.", role: "Headmaster, Duayaw Nkwanta" },
              { text: "My farming business relies on weather updates and market prices. The reliable internet keeps me connected always.", author: "Ama O.", role: "Local Farmer" },
              { text: "They built a custom management system for my shop that makes inventory a breeze. Exceptional service!", author: "Yaw M.", role: "Business Owner" }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-sm relative"
              >
                <div className="flex gap-1 text-yellow-400 mb-6">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.text}"</p>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
                {/* Quote icon watermark */}
                <div className="absolute top-6 right-6 text-[8rem] leading-none font-serif text-gray-50 opacity-50 select-none">"</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-heading font-bold mb-4">Latest Insights</h2>
              <p className="text-xl text-gray-600">News, updates, and tech tips from our team.</p>
            </div>
            <Link href="/blog" className="hidden md:inline-flex items-center font-bold text-primary hover:text-primary-dark">
              View all posts <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Expanding Coverage to Surroundings of Duayaw Nkwanta", category: "Rural Connectivity", date: "Oct 12, 2023", image: "/rural_tech.png" },
              { title: "5 Ways Custom Software Can Grow Your Local Business", category: "Software Tips", date: "Nov 05, 2023", image: "/project_dashboard.png" },
              { title: "Digital Literacy: Empowering the Next Generation", category: "Tech Nationwide", date: "Dec 01, 2023", image: "/team_meeting.png" }
            ].map((post, i) => (
              <motion.article 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="h-48 bg-gray-100 rounded-2xl mb-4 overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  {/* Post Cover Image */}
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="font-semibold text-primary">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-3">
                  {post.title}
                </h3>
              </motion.article>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link href="/blog" className="inline-flex items-center font-bold text-primary">
              View all posts <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
