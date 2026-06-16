"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source).url();
}

// Fallback mock posts for when Sanity is not yet configured
const mockPostContent: Record<string, any> = {
  "expanding-coverage": {
    title: "Expanding Coverage to Surroundings of Duayaw Nkwanta",
    category: "Rural Connectivity",
    date: "Oct 12, 2023",
    author: "Kofi Mensah",
    image: "/rural_tech.png",
    body: `<p>We are thrilled to announce the completion of our latest infrastructure project — a new transmission tower that brings high-speed internet connectivity to three surrounding communities: Akrodie, Hwidiem Junction, and Kukuom.</p>
    <p>This expansion has been months in the making, involving careful terrain surveys, community meetings, and complex logistics to transport and install the equipment. Our engineering team worked tirelessly to ensure the network backbone is robust and capable of handling hundreds of simultaneous connections.</p>
    <h2>What this means for you</h2>
    <p>Residents and businesses in these areas can now access reliable broadband for the first time. Students will have access to e-learning resources, traders can access market data, and local businesses can now build an online presence.</p>
    <p>We are committed to continuing this expansion across the entire Ahafo Region. Stay tuned for more announcements in the coming months.</p>`,
  },
  "custom-software-growth": {
    title: "5 Ways Custom Software Can Grow Your Local Business",
    category: "Software Tips",
    date: "Nov 05, 2023",
    author: "Kwasi Appiah",
    image: "/project_dashboard.png",
    body: `<p>Many local business owners believe that software is only for big corporations. This is simply not true. Custom software, built specifically for your needs, can be one of the most powerful investments you make in your business growth.</p>
    <h2>1. Automate Repetitive Tasks</h2>
    <p>Stop spending hours on manual data entry. A simple inventory system can automatically update your stock levels when you make a sale.</p>
    <h2>2. Understand Your Customers Better</h2>
    <p>A customer management system helps you track who is buying what, allowing you to tailor your offerings and improve loyalty.</p>
    <h2>3. Accept Payments Online</h2>
    <p>An e-commerce platform means your shop is open 24/7, even when you are not physically present.</p>
    <h2>4. Manage Your Team More Effectively</h2>
    <p>Payroll software, attendance tracking, and task management tools reduce administrative burden and ensure everyone is accountable.</p>
    <h2>5. Build Trust and Credibility</h2>
    <p>A professional website and digital presence signals to customers that you are a serious, established business. This alone can dramatically increase sales.</p>`,
  },
  "digital-literacy": {
    title: "Digital Literacy: Empowering the Next Generation",
    category: "Tech in Ahafo",
    date: "Dec 01, 2023",
    author: "Abena Osei",
    image: "/team_meeting.png",
    body: `<p>Last weekend, Infoway hosted its first Digital Literacy Bootcamp at the Duayaw Nkwanta Community Center. Over 50 students from various schools attended the two-day event, learning the fundamentals of computing, internet safety, and basic web design.</p>
    <p>The event was a resounding success. Participants ranged in age from 12 to 25, and many were using a computer for the first time. By the end of the second day, every student had built their own simple web page using HTML and CSS.</p>
    <h2>What We Taught</h2>
    <ul>
      <li>How the Internet works</li>
      <li>Safe and responsible online behaviour</li>
      <li>Introduction to Microsoft Office tools</li>
      <li>Basic HTML and CSS web design</li>
      <li>Introduction to problem-solving and coding concepts</li>
    </ul>
    <p>We extend our deep gratitude to the community leaders and school principals who supported and promoted this initiative. We plan to run these bootcamps quarterly. If your school would like to participate, please contact us.</p>`,
  },
};

export default function BlogPost() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);

      // Try fetching from Sanity first
      if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
        try {
          const sanityPost = await client.fetch(
            `*[_type == "post" && slug.current == $slug][0] {
              title,
              "slug": slug.current,
              author,
              mainImage,
              categories,
              publishedAt,
              excerpt,
              body
            }`,
            { slug }
          );
          if (sanityPost) {
            setPost({
              title: sanityPost.title,
              author: sanityPost.author || "Infoway Team",
              category: sanityPost.categories?.[0] || "General",
              date: new Date(sanityPost.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              imageUrl: sanityPost.mainImage ? urlFor(sanityPost.mainImage) : null,
              body: sanityPost.body,
              isSanity: true,
            });
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Sanity fetch error", e);
        }
      }

      // Fallback to mock data
      const mock = mockPostContent[slug];
      if (mock) setPost(mock);
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900">Article not found</h1>
        <p className="text-gray-600">This article may have been removed or does not exist.</p>
        <Link href="/blog" className="px-6 py-3 bg-primary text-white font-bold rounded-full">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] bg-gray-900 overflow-hidden">
        {post.imageUrl || post.image ? (
          <img
            src={post.imageUrl || post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1 font-semibold text-primary bg-primary/20 px-3 py-1 rounded-full text-sm mb-4">
              <Tag className="w-3 h-3" /> {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{post.date}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>

      {/* Body */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto px-4 sm:px-8 py-12"
      >
        {post.isSanity ? (
          // Sanity portable text would be rendered here with @portabletext/react in a full setup
          <div className="prose prose-lg prose-orange max-w-none">
            {JSON.stringify(post.body)}
          </div>
        ) : (
          <div
            className="prose prose-lg prose-orange max-w-none"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        )}
      </motion.div>

      {/* CTA */}
      <div className="bg-accent-light py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Enjoyed this article?</h2>
          <p className="text-gray-600 mb-8">Get in touch with us to learn how Infoway can help your community or business.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
            Contact Infoway
          </Link>
        </div>
      </div>
    </article>
  );
}
