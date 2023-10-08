// src/models/Category.ts
import mongoose, { Document, Schema } from 'mongoose';

interface Category extends Document {
    name: string;
    parent?: Category | null;
    isActive: boolean;
}

const categorySchema = new Schema<Category>(
    {
        name: { type: String, required: true, unique: true },
        parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<Category>('Category', categorySchema);
