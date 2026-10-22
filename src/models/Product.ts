import mongoose, { Schema, models, model } from 'mongoose';

export interface IProduct {
  _id?: string;
  businessId: string;
  businessName: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  inStock: boolean;
  featured?: boolean;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    businessId: { type: String, required: true, index: true },
    businessName: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    image: { type: String },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Product = models.Product || model<IProduct>('Product', ProductSchema);
