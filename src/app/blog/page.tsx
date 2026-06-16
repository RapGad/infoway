"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, ArrowRight, Calendar, User, Tag } from "lucide-react";
import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).url();
}

const mockPosts = [
  {
    id: "expanding-coverage",
    title: "Expanding Coverage to Surroundings of Duayaw Nkwanta",
    excerpt: "We are thrilled to announce the completion of our new cell tower that will bring high-speed internet to three new villages in the Ahafo region.",
    category: "Rural Connectivity",
    date: "Oct 12, 2023",
    author: "Kofi Mensah",
    image: "bg-gradient-to-br from-orange-400 to-red-500"
  },
  {
    id: "custom-software-growth",
    title: "5 Ways Custom Software Can Grow Your Local Business",
    excerpt: "From inventory management to customer engagement, discover how tailored digital solutions can transform your operations.",
    category: "Software Tips",
    date: "Nov 05, 2023",
    author: "Kwasi Appiah",
    image: "bg-gradient-to-br from-blue-400 to-indigo-500"
  },
  {
    id: "digital-literacy",
    title: "Digital Literacy: Empowering the Next Generation",
    excerpt: "Highlights from our recent training bootcamp at the Duayaw Nkwanta Community Center, where over 50 students learned basic coding.",
    category: "Tech in Ahafo",
    date: "Dec 01, 2023",
    author: "Abena Osei",
    image: "bg-gradient-to-br from-emerald-400 to-teal-500"
  },
];

const categories = ["Rural Connectivity", "Software Tips", "Tech in Ahafo", "Case Studies"];

async function getPosts() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return mockPosts;
  }
  
  try {
    const posts = await client.fetch(`
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        author,
        mainImage,
        categories,
        publishedAt,
        excerpt
      }
    `);
    
    if (posts.length === 0) return mockPosts;
    
    return posts.map((p: any) => ({
      id: p.slug,
      title: p.title,
      excerpt: p.excerpt || "Click to read more...",
      category: p.categories?.[0] || "General",
      date: new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: p.author || "Infoway Team",
      imageUrl: p.mainImage ? urlFor(p.mainImage) : null,
      image: "bg-gray-200"
    }));
  } catch (e) {
    console.error("Sanity fetch error:", e);
    return mockPosts;
  }
}

export default async function Blog() {
  const posts = await getPosts();

  return (
    <>
      <section className="bg-gray-50 py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-heading font-bold mb-6 text-gray-900"
          >
            Insights & <span className="text-primary">News.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Stay updated with our latest projects, tech tutorials, and stories from the Ahafo Region.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="space-y-12">
                {posts.map((post: any, i: number) => (
                  <article key={post.id} className="group">
                    <Link href={`/blog/${post.id}`} className="block relative h-64 md:h-80 rounded-3xl overflow-hidden mb-6 bg-gray-100">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className={`absolute inset-0 ${post.image} opacity-80 group-hover:scale-105 transition-transform duration-700`}></div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </Link>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1 font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        <Tag className="w-4 h-4" /> {post.category}
                      </span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                      <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
                    </div>
                    
                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h2>
                    
                    <p className="text-gray-600 text-lg mb-6 line-clamp-2">{post.excerpt}</p>
                    
                    <Link href={`/blog/${post.id}`} className="inline-flex items-center font-bold text-primary hover:text-primary-dark group-hover:translate-x-2 transition-transform">
                      Read full article <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-28 space-y-8">
                
                {/* Search */}
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Search</h3>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search articles..." 
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                  <ul className="space-y-3">
                    {categories.map(cat => (
                      <li key={cat}>
                        <Link href={`/blog?category=${cat}`} className="flex justify-between items-center text-gray-600 hover:text-primary transition-colors">
                          <span>{cat}</span>
                          <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md">{Math.floor(Math.random() * 5) + 1}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="bg-primary p-8 rounded-3xl text-white text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <h3 className="text-2xl font-bold mb-2 relative z-10">Need a tech partner?</h3>
                  <p className="text-white/80 mb-6 relative z-10">Let's discuss how we can help your business grow.</p>
                  <Link href="/contact" className="inline-block px-6 py-3 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-colors relative z-10">
                    Contact Us
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
