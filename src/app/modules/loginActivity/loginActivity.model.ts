import mongoose, { Schema, Document } from 'mongoose';
import { ILoginHitory } from './loginActivity.interface';



const loginHistorySchema = new mongoose.Schema<ILoginHitory>(
  {
    user: {
      type:Schema.Types.ObjectId,
      required: true
    },
    name:{
      type: String,
      required: true,
    },
    email:{
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    device: {
      type: String, 
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const LoginHistory =
  mongoose.models.LoginActivity || mongoose.model<ILoginHitory>('LoginHistory', loginHistorySchema);
