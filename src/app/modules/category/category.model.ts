import { Schema, model } from 'mongoose';
import { ICategory } from './category.interface';

// Define the Category schema
const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true, 
      unique: true, 
    },
    description: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true, 
  }
);

// Create the Category model from the schema
export const Category = model<ICategory>('Category', CategorySchema);
