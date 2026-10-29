import mongoose, { Schema, models, model } from 'mongoose';

export type FeedbackCategory =
  | 'connectivity'
  | 'vouchers'
  | 'customer_service'
  | 'pricing'
  | 'feature_request'
  | 'general';

export type FeedbackStatus =
  | 'new'
  | 'reviewed'
  | 'in_progress'
  | 'resolved'
  | 'archived';

export interface IFeedback {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  category: FeedbackCategory;
  rating: number; // 1 to 5
  subject?: string;
  message: string;
  location?: string; // Campus, Hostel, town or area
  role?: string; // student, resident, business, visitor
  status: FeedbackStatus;
  adminNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    name: { type: String, trim: true, default: 'Anonymous' },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    category: {
      type: String,
      enum: ['connectivity', 'vouchers', 'customer_service', 'pricing', 'feature_request', 'general'],
      default: 'general',
    },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    subject: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    role: { type: String, trim: true, default: 'student' },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'in_progress', 'resolved', 'archived'],
      default: 'new',
    },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Feedback = models.Feedback || model<IFeedback>('Feedback', FeedbackSchema);
