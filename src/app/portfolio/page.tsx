"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Code, Database, Layout } from "lucide-react";

// Mock Projects
const projects = [
  {
    id: 1,
    title: "National Market Connect",
    category: "Web App",
    client: "Duayaw Nkwanta Traders Association",
    image: "/project_dashboard.png",
    challenge: "Local traders lacked a centralized platform to showcase goods and connect with buyers outside the immediate region, limiting their sales potential.",
    solution: "We built a robust, mobile-first e-commerce dashboard that works efficiently even on slow networks, allowing traders to manage inventory and receive orders via SMS.",
    results: "30% increase in regional sales within the first 3 months. Over 200 active traders onboarded.",
    tech: ["Next.js", "TailwindCSS", "Supabase", "Twilio API"]
  },
  {
    id: 2,
    title: "FarmGuard Management System",
    category: "Mobile App",
    client: "AgriTech Ghana Cooperative",
    image: "/project_mobile.png",
    challenge: "Cooperative managers were tracking crop yields and fertilizer distribution on paper, leading to lost data and inefficiencies.",
    solution: "Developed an offline-capable mobile app for field agents to log data, which syncs to a central cloud dashboard when internet is available.",
    results: "Reduced data entry errors by 90% and saved 15 hours of administrative work per week.",
    tech: ["React Native", "Node.js", "MongoDB", "Redux Offline"]
  },
  {
    id: 3,
    title: "EduLink Portal",
    category: "Platform",
    client: "Regional Education Board",
    image: "/project_dashboard.png",
    challenge: "Schools lacked a reliable way to share resources, track student attendance, and communicate with parents securely.",
    solution: "Created a comprehensive educational portal with role-based access, automated SMS attendance alerts, and a local resource repository.",
    results: "Adopted by 12 local schools. Improved parent-teacher communication response times significantly.",
    tech: ["React", "Express", "PostgreSQL", "AWS S3"]
  },
  {
    id: 4,
    title: "HealthTrack Clinic CMS",
    category: "Web App",
    client: "National Community Clinic",
    image: "/project_mobile.png",
    challenge: "Patient records were entirely paper-based, making history tracking difficult and prone to damage or loss.",
    solution: "Built a secure, fast, and highly intuitive patient management system tailored to the clinic's specific workflow, compliant with local health data regulations.",
    results: "Decreased patient wait times by 20% and completely digitized over 5,000 records.",
    tech: ["Next.js", "Prisma", "TailwindCSS", "Vercel"]
  }
];

const categories = ["All", "Web App", "Mobile App", "Platform"];

export default function Portfolio() {
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <>
      {/* Header */}
      <section className="bg-white py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-heading font-bold mb-6 text-gray-900"
          >
            Our <span className="text-primary">Work.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Explore the custom software solutions we've built to drive growth and efficiency for Ghanaian businesses.
          </motion.p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-24 bg-gray-50 min-h-screen relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === cat 
                    ? "bg-primary text-white shadow-md" 
                    : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={project.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="h-64 bg-gray-200 relative overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10"></div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-sm font-bold text-primary tracking-wider uppercase mb-2 block">{project.category}</span>
                        <h3 className="text-2xl font-heading font-bold text-gray-900">{project.title}</h3>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-2">{project.challenge}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 3).map(tech => (
                        <span key={tech} className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{tech}</span>
                      ))}
                      {project.tech.length > 3 && <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">+{project.tech.length - 3}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
            >
              <button 
                className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors z-20"
                onClick={() => setSelectedProject(null)}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-64 sm:h-80 bg-gray-800 relative overflow-hidden rounded-t-3xl">
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
              </div>

              <div className="p-8 sm:p-12">
                <span className="text-sm font-bold text-primary tracking-wider uppercase mb-2 block">{selectedProject.category}</span>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2">{selectedProject.title}</h2>
                <p className="text-lg text-gray-500 mb-8 font-medium">Client: {selectedProject.client}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Layout className="w-5 h-5 text-primary" /> The Challenge
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProject.challenge}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary" /> Our Solution
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProject.solution}</p>
                  </div>
                </div>

                <div className="bg-accent-light p-8 rounded-2xl mb-12 border border-primary/10">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" /> Key Results
                  </h3>
                  <p className="text-gray-800 font-medium text-lg leading-relaxed">{selectedProject.results}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tech.map(tech => (
                      <span key={tech} className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-xl">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
