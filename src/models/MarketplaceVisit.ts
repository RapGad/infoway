import mongoose, { Schema, models, model } from 'mongoose';

export interface IMarketplaceVisit {
  _id?: string;
  source: string; // e.g. "hotspot_login", "hotspot_alogin", "hotspot_status", "direct", "qr"
  macAddress?: string; // Captured from MikroTik $(mac)
  username?: string; // Voucher code / username $(username)
  ip?: string;
  userAgent?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  path: string;
  businessName?: string;
  productName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MarketplaceVisitSchema = new Schema<IMarketplaceVisit>(
  {
    source: { type: String, default: 'direct', index: true },
    macAddress: { type: String, index: true },
    username: { type: String, index: true },
    ip: { type: String },
    userAgent: { type: String },
    deviceType: { type: String, enum: ['mobile', 'tablet', 'desktop'], default: 'mobile' },
    path: { type: String, default: '/partnership' },
    businessName: { type: String },
    productName: { type: String },
  },
  { timestamps: true }
);

MarketplaceVisitSchema.index({ createdAt: -1 });

export const MarketplaceVisit =
  models.MarketplaceVisit || model<IMarketplaceVisit>('MarketplaceVisit', MarketplaceVisitSchema);
