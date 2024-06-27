import { Request, Response } from 'express';

export class UrlController {

  
  public encode = async (req: Request, res: Response): Promise<void> => {
    try {
     
      const shortUrl = "";
      res.status(201).json({ shortUrl });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public decode = async (req: Request, res: Response): Promise<void> => {
    try {
     
      const originalUrl = "";
      res.status(200).json({ originalUrl });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  public statistic = async (req: Request, res: Response): Promise<void> => {
    try {
      const { urlPath } = req.params;
      const stats = [];
      res.status(200).json(stats);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
}
