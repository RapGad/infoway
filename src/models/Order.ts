import mongoose, { Schema, models, model } from 'mongoose';

export interface IOrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  businessId: string;
  businessName: string;
}

export interface IOrder {
  _id?: string;
  orderNumber: string;
  businessId?: string;
  businessName?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    city: string;
  };
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'confirmed' | 'delivered' | 'cancelled';
  notes?: string;
  paymentMethod: 'cash_on_delivery' | 'mobile_money' | 'pickup';
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  businessId: { type: String, required: true },
  businessName: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    businessId: { type: String },
    businessName: { type: String },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      deliveryAddress: { type: String, required: true },
      city: { type: String, required: true },
    },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'confirmed', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String },
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'mobile_money', 'pickup'],
      default: 'cash_on_delivery',
    },
  },
  { timestamps: true }
);

export const Order = models.Order || model<IOrder>('Order', OrderSchema);
