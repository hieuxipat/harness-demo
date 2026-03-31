import mongoose, { Document, Schema } from 'mongoose';

export interface IExample extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExampleSchema = new Schema<IExample>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true },
);

ExampleSchema.index({ name: 1 });

export const ExampleModel = mongoose.model<IExample>('Example', ExampleSchema);
