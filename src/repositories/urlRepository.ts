import { Model } from 'mongoose';
import UrlModel, { IUrl } from '../models/urlModel';

export class UrlRepository {
  private model: Model<IUrl>;

  constructor() {
    this.model = UrlModel;
  }

  public async findByShortUrl(shortUrl: string): Promise<IUrl | null> {
    return this.model.findOne({ shortUrl }).exec();
  }

  public async save(url: IUrl): Promise<IUrl> {
    return this.model.create(url);
  }

  public async incrementHits(shortUrl: string): Promise<void> {
    await this.model.updateOne({ shortUrl }, { $inc: { hits: 1 } }).exec();
  }
}
