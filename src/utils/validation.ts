import * as Joi from 'joi';
import { ValidationError } from 'joi';

export const validate = async (data: any, schema: Joi.Schema): Promise<void> => {
    try {
        await schema.validateAsync(data);
    } catch (error: unknown) {
        if (error instanceof ValidationError) {
            throw new Error(error.details[0].message);
        } else {
            throw error; // rethrow the error if it's not a Joi.ValidationError
        }
    }
};
