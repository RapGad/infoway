import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import { Business } from '@/models/Business';
import { Product } from '@/models/Product';
import { Admin } from '@/models/Admin';

const DEFAULT_ADMIN = {
  name: "Infoway Administrator",
  email: "admin@infoway.com",
  password: "adminpassword123",
  role: "superadmin" as const,
};

const SAMPLE_BUSINESSES = [
  {
    name: "Golden Crust Bakery & Cafe",
    category: "Food & Groceries",
    description: "Freshly baked artisan bread, pastries, cakes, and rich local coffee. Powered by Infoway Hotspots for order pick-ups.",
    location: "Main Street, Duayaw Nkwanta",
    phone: "+233 24 111 2233",
    email: "goldencrust@infowaypartners.com",
    badge: "Hotspot Partner",
    isActive: true,
    products: [
      {
        name: "Fresh Butter Bread (Family Loaf)",
        description: "Soft, golden-baked sweet butter bread made fresh every morning.",
        price: 25,
        category: "Bakery",
        inStock: true,
        featured: true,
        tags: ["Fresh", "Best Seller"],
      },
      {
        name: "Gourmet Meat Pie (Box of 4)",
        description: "Crispy flaky pastry loaded with seasoned minced beef and herbs.",
        price: 40,
        category: "Pastries",
        inStock: true,
        featured: false,
        tags: ["Snack", "Hot"],
      },
      {
        name: "Rich Local Roasted Coffee Beans (250g)",
        description: "Locally sourced Ghanaian premium Arabica coffee beans.",
        price: 60,
        category: "Beverages",
        inStock: true,
        featured: true,
        tags: ["Coffee", "Local"],
      },
    ],
  },
  {
    name: "NexTech Electronics Hub",
    category: "Electronics & Gadgets",
    description: "Authorized dealer in smartphones, power banks, chargers, audio accessories, and fast phone screen repairs.",
    location: "Commercial Road, Duayaw Nkwanta",
    phone: "+233 55 999 8877",
    email: "nextech@infowaypartners.com",
    badge: "Verified Merchant",
    isActive: true,
    products: [
      {
        name: "Heavy Duty 20,000mAh Fast Power Bank",
        description: "Dual USB-C fast charging with digital battery indicator.",
        price: 220,
        category: "Accessories",
        inStock: true,
        featured: true,
        tags: ["Power", "Fast Charge"],
      },
      {
        name: "Wireless Bluetooth Stereo Earbuds",
        description: "Noise cancelling wireless earbuds with deep bass and 24h battery life.",
        price: 180,
        category: "Audio",
        inStock: true,
        featured: true,
        tags: ["Audio", "Wireless"],
      },
      {
        name: "Braided 65W Fast-Charging Cable (Type-C)",
        description: "Durable tangle-free nylon cable compatible with Android and Laptops.",
        price: 45,
        category: "Cables",
        inStock: true,
        featured: false,
        tags: ["Accessories"],
      },
    ],
  },
  {
    name: "AfriCraft Fashion & Fabrics",
    category: "Fashion & Apparel",
    description: "Premium African print fabrics (Kente, Woodin, GTP), tailored shirts, dresses, and customized embroidery.",
    location: "Central Market Square, Duayaw Nkwanta",
    phone: "+233 20 444 5566",
    email: "africraft@infowaypartners.com",
    badge: "Featured Partner",
    isActive: true,
    products: [
      {
        name: "Authentic GTP Wax Print (6 Yards)",
        description: "100% pure cotton vibrant African print fabric for occasions.",
        price: 320,
        category: "Fabrics",
        inStock: true,
        featured: true,
        tags: ["Fabric", "Premium"],
      },
      {
        name: "Handcrafted Men's Kaftan Shirt",
        description: "Modern minimalist tailored Kaftan shirt with subtle chest embroidery.",
        price: 190,
        category: "Clothing",
        inStock: true,
        featured: true,
        tags: ["Men", "Clothing"],
      },
    ],
  },
  {
    name: "AgriBoost Farm Supplies",
    category: "Agriculture",
    description: "Certified seeds, organic fertilizers, knapsack sprayers, and farm equipment for local growers.",
    location: "Agric Road, Techiman Highway",
    phone: "+233 24 888 7766",
    email: "agriboost@infowaypartners.com",
    badge: "Verified Merchant",
    isActive: true,
    products: [
      {
        name: "Manual 16L Knapsack Sprayer",
        description: "Heavy duty plastic knapsack sprayer with adjustable brass nozzle.",
        price: 280,
        category: "Equipment",
        inStock: true,
        featured: true,
        tags: ["Farming", "Tools"],
      },
      {
        name: "High-Yield Tomato Seed Pack (100g)",
        description: "Drought and disease resistant hybrid tomato seeds.",
        price: 75,
        category: "Seeds",
        inStock: true,
        featured: false,
        tags: ["Seeds"],
      },
    ],
  },
];

export async function POST() {
  try {
    await connectDB();

    // 1. Seed or update default admin user
    const existingAdmin = await Admin.findOne({ email: DEFAULT_ADMIN.email });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, salt);
      await Admin.create({
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        passwordHash,
        role: DEFAULT_ADMIN.role,
      });
    }

    // 2. Seed businesses & products if empty
    const existingBusinessCount = await Business.countDocuments();
    if (existingBusinessCount === 0) {
      for (const b of SAMPLE_BUSINESSES) {
        const createdBiz = await Business.create({
          name: b.name,
          category: b.category,
          description: b.description,
          location: b.location,
          phone: b.phone,
          email: b.email,
          badge: b.badge,
          isActive: b.isActive,
        });

        for (const p of b.products) {
          await Product.create({
            businessId: createdBiz._id.toString(),
            businessName: createdBiz.name,
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            inStock: p.inStock,
            featured: p.featured,
            tags: p.tags,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Seed completed successfully',
      adminCredentials: {
        email: DEFAULT_ADMIN.email,
        password: DEFAULT_ADMIN.password,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: 'Failed to seed database' }, { status: 500 });
  }
}
