import mongoose, { Schema } from 'mongoose';
import { IPayment } from './payments.interface';

const postSchema = new Schema<IPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: Number,
    transactionID:String
  },
  { timestamps: true },
);

export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', postSchema);
