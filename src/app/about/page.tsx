"use client";

import { motion } from "framer-motion";
import { CheckCircle, Users, Target, Heart, Zap } from "lucide-react";
import Image from "next/image";

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

export default function About() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-gray-50 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-heading font-bold mb-6 text-gray-900"
          >
            Rooted in <span className="text-primary">Ahafo.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            We are more than just an ISP. We are local engineers, builders, and dreamers committed to our region's digital future.
          </motion.p>
        </div>
      </section>

      {/* Our Story & Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.h2 variants={fadeIn} className="text-4xl font-heading font-bold mb-6 text-gray-900">
                Our Story
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-gray-600 mb-6 leading-relaxed">
                Infoway began with a simple observation: rural communities in Ghana were being left behind in the digital revolution. Major telcos found it unprofitable to build permanent infrastructure in places like Duayaw Nkwanta.
              </motion.p>
              <motion.p variants={fadeIn} className="text-lg text-gray-600 mb-8 leading-relaxed">
                What started as a small fibre business facing numerous challenges soon pivoted into a resilient, future-proof rural ISP. We realized that if we wanted reliable internet and software, we had to build it ourselves. Today, we stand as a beacon of local innovation.
              </motion.p>

              <motion.div variants={fadeIn} className="bg-accent-light p-8 rounded-3xl border-l-4 border-primary">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-xl text-gray-800 italic">
                  "To build permanent digital infrastructure that stays long after we’re gone."
                </p>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4 h-[600px]"
            >
              <div className="bg-gray-200 rounded-[2rem] h-full mt-12 relative overflow-hidden group shadow-lg">
                 <img src="/local_town.png" alt="Duayaw Nkwanta Local Community" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-primary/20 group-hover:opacity-0 transition-opacity z-10"></div>
              </div>
              <div className="bg-gray-300 rounded-[2rem] h-full mb-12 relative overflow-hidden group shadow-lg">
                 <img src="/rural_tech.png" alt="Tower Installation" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gray-900/20 group-hover:opacity-0 transition-opacity z-10"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">What Drives Us</h2>
            <p className="text-xl text-gray-400">The core values behind every tower we build and app we code.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Zap className="w-8 h-8" />, title: "Innovation", desc: "Finding creative, rugged solutions to complex rural tech problems." },
              { icon: <CheckCircle className="w-8 h-8" />, title: "Reliability", desc: "Building networks and software that people can depend on, rain or shine." },
              { icon: <Users className="w-8 h-8" />, title: "Community-First", desc: "Prioritising the needs, education, and growth of Ahafo locals." },
              { icon: <Heart className="w-8 h-8" />, title: "Transparency", desc: "Honest pricing, clear communication, and no hidden catches." }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-gray-800 p-8 rounded-3xl border border-gray-700 hover:border-primary transition-colors"
              >
                <div className="text-primary mb-6">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4 text-gray-900">Meet the Team</h2>
            <p className="text-xl text-gray-600">The friendly faces behind Infoway.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Real Team Members */}
            {[
              { name: "APPIAH-BOATENG ALBERT", role: "CEO", desc: "Visionary behind Infoway's rural strategy." },
              { name: "JEFFREY ADJEI HAYFORD", role: "Head of Software", desc: "Architect of our custom business dashboards." },
              { name: "DAVID BROBBEY", role: "Data Analyst", desc: "Translating community data into actionable insights." },
              { name: "ERIC AMOATENG", role: "Data Analyst", desc: "Optimizing our networks with predictive analytics." }
            ].map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                className="text-center group"
              >
                <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full mb-6 overflow-hidden relative group-hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] group-hover:scale-105 transition-all duration-500 border-4 border-transparent group-hover:border-primary/20">
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                    [Photo]
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
