import { model, Schema, Document, Model } from 'mongoose';

export interface ClearanceLevelDocument extends Document {
    level: string;
    createdAt: Date;
    updatedAt: Date;
}

const RoleSchema = new Schema(
    {
        level: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

const ClearanceLevel: Model<ClearanceLevelDocument> = model<ClearanceLevelDocument>('ClearanceLevel', RoleSchema);

export default ClearanceLevel;
