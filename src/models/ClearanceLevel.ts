import mongoose, { model, Schema, Document, Model } from 'mongoose';

export interface ClearanceLevel extends Document {
  level: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema(
  {
    level: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export type ClearanceLevelDocument = mongoose.Document & ClearanceLevel;

const ClearanceLevel: Model<ClearanceLevelDocument> =
  model<ClearanceLevelDocument>('ClearanceLevel', RoleSchema);

export default ClearanceLevel;
