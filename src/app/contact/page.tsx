"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Mock submission
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  return (
    <>
      <section className="bg-gray-50 py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-6 mb-6"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900">
              Get in <span className="text-primary">Touch.</span>
            </h1>
            <div className="text-primary">
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="64" height="64" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                />
              </motion.svg>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Ready to bring internet to your community or start a software project? We're here to help.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
              className="lg:col-span-2 space-y-12"
            >
              <div>
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-8">Reach out directly or visit our headquarters in Duayaw Nkwanta.</p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center text-primary shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">Office Address</h4>
                      <p className="text-gray-600 mt-1">Main Tech Hub, near the central market<br />Accra, Ghana<br />Ghana</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center text-primary shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">Phone / WhatsApp</h4>
                      <p className="text-gray-600 mt-1"><a href="tel:+233000000000" className="hover:text-primary transition-colors">+233 (0) 000 000 000</a></p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center text-primary shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">Email Us</h4>
                      <p className="text-gray-600 mt-1"><a href="mailto:hello@infoway.com.gh" className="hover:text-primary transition-colors">hello@infoway.com.gh</a></p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center text-primary shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">Working Hours</h4>
                      <p className="text-gray-600 mt-1">Mon - Fri: 8:00 AM - 5:00 PM<br />Sat: 9:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-3 bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-3xl p-8 md:p-12"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>

              {formState === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                  <p>Thank you for reaching out. A member of the Infoway team will get back to you shortly.</p>
                  <button onClick={() => setFormState('idle')} className="mt-6 text-green-700 font-semibold hover:underline">Send another message</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input type="text" id="name" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input type="tel" id="phone" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="+233..." />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" id="email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" placeholder="john@example.com" />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">Service of Interest</label>
                    <select id="service" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors appearance-none">
                      <option value="internet">Rural Internet</option>
                      <option value="software">Software Development</option>
                      <option value="consulting">IT Consulting & Support</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                    <textarea id="message" rows={5} required className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none" placeholder="How can we help you?"></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {formState === 'submitting' ? (
                      <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</span>
                    ) : (
                      <span className="flex items-center gap-2">Send Message <Send className="w-5 h-5" /></span>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Embed */}
      <section className="h-[500px] w-full bg-gray-200 relative overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15830.435777717013!2d-2.1643444999999998!3d7.17113845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdc94dd5465d3d3%3A0xb3e10411d9f8260f!2sDuayaw%20Nkwanta%2C%20Ghana!5e0!3m2!1sen!2suk!4v1714488800000!5m2!1sen!2suk"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale hover:grayscale-0 transition-all duration-700"
        ></iframe>
      </section>
    </>
  );
}
