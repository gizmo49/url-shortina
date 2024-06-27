import { Schema, model, Document } from 'mongoose';

export interface IUrl extends Document {
    originalUrl: string;
    shortUrl: string;
    hits: number;
}

const urlSchema = new Schema<IUrl>({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    hits: { type: Number, default: 0 },
});

const Url = model<IUrl>('Url', urlSchema);

export default Url;
