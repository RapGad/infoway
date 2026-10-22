import mongoose, { Schema, models, model } from 'mongoose';

export interface IAdmin {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'superadmin' | 'manager';
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'manager'], default: 'superadmin' },
  },
  { timestamps: true }
);

export const Admin = models.Admin || model<IAdmin>('Admin', AdminSchema);
