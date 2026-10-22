import mongoose, { Schema, models, model } from 'mongoose';

export interface IBusiness {
  _id?: string;
  name: string;
  category: string; // e.g. "Electronics & Gadgets", "Fashion & Apparel", "Food & Groceries", "Services & Repairs", "Agriculture"
  description: string;
  location: string;
  phone: string;
  email?: string;
  logo?: string;
  banner?: string;
  badge?: string; // e.g. "Featured Partner", "Verified Merchant", "Hotspot Partner"
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    logo: { type: String },
    banner: { type: String },
    badge: { type: String, default: 'Partner Business' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Business = models.Business || model<IBusiness>('Business', BusinessSchema);
