import * as Joi from 'joi';

export const validate = async (data: any, schema: Joi.Schema): Promise<void> => {
  try {
    await schema.validateAsync(data);
  } catch (error) {
    throw new Error(error.details[0].message);
  }
};
