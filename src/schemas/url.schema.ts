import * as Joi from 'joi';
import { EncodeUrlDto } from '../dtos/encodeUrlDto';
import { DecodeUrlDto } from '../dtos/decodeUrlDto';

export const encodeUrlSchema = Joi.object<EncodeUrlDto>({
  originalUrl: Joi.string().uri().required(),
});

export const decodeUrlSchema = Joi.object<DecodeUrlDto>({
  shortUrl: Joi.string().required(),
});
