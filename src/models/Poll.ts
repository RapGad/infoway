import mongoose, { Schema, models, model } from 'mongoose';

export interface IPollOption {
  _id?: string;
  text: string;
  votes: number;
}

export interface IPoll {
  _id?: string;
  question: string;
  category: 'pricing' | 'service' | 'feature' | 'general';
  description?: string;
  options: IPollOption[];
  isActive: boolean;
  totalVotes: number;
  voterIps?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const PollOptionSchema = new Schema<IPollOption>({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const PollSchema = new Schema<IPoll>(
  {
    question: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['pricing', 'service', 'feature', 'general'],
      default: 'pricing',
    },
    description: { type: String },
    options: [PollOptionSchema],
    isActive: { type: Boolean, default: true },
    totalVotes: { type: Number, default: 0 },
    voterIps: [{ type: String }],
  },
  { timestamps: true }
);

export const Poll = models.Poll || model<IPoll>('Poll', PollSchema);
