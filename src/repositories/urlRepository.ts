import { Document, Model } from 'mongoose';
import Url, { IUrl } from '../models/urlModel.ts';

export class UrlRepository {
    private urlModel: Model<IUrl>;

    constructor() {
        this.urlModel = Url;
    }

    public async create(urlData: any): Promise<Document> {
        const url = new this.urlModel(urlData);
        return url.save();
    }

    public async findByShortUrl(shortUrl: string): Promise<Document | null> {
        return this.urlModel.findOne({ shortUrl });
    }

    public async incrementHits(shortUrl: string): Promise<void> {
        await this.urlModel.updateOne({ shortUrl }, { $inc: { hits: 1 } });
    }
}
