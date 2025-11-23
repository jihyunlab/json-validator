import { JsonValidationResult } from '../interfaces/json-validation.interface';
import Ajv from 'ajv';

const ajv = new Ajv();

export const JsonValidationHelper = {
  async validate(json: object, schema: object): Promise<JsonValidationResult> {
    if (!json) {
      return { valid: false, message: 'The json parameter is missing.' };
    }

    if (!schema) {
      return { valid: false, message: 'The schema parameter is missing.' };
    }

    const validate = ajv.compile(schema);
    const valid = validate(json);

    if (!valid) {
      if (validate.errors) {
        return {
          valid: false,
          message: 'The validation has failed.',
          errors: validate.errors,
        };
      }

      return { valid: false, message: 'The validation has failed.' };
    }

    return { valid: true, message: 'The validation was passed.' };
  },
};
