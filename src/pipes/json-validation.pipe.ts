import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import {
  JsonRequestSchema,
  JsonValidationResult,
} from '../interfaces/json-validation.interface';
import { JsonValidationHelper } from '../helpers/json-validation.helper';

export class JsonValidationPipe implements PipeTransform {
  constructor(private readonly jsonRequestSchema: JsonRequestSchema) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata || !metadata.type) {
      return value;
    }

    let result: JsonValidationResult = {
      valid: true,
      message: 'The request has passed validation.',
    };

    if (metadata.type === 'param' && this.jsonRequestSchema.parameter) {
      result = await JsonValidationHelper.validate(
        value,
        this.jsonRequestSchema.parameter
      );
    }

    if (metadata.type === 'query' && this.jsonRequestSchema.query) {
      result = await JsonValidationHelper.validate(
        value,
        this.jsonRequestSchema.query
      );
    }

    if (metadata.type === 'body' && this.jsonRequestSchema.body) {
      result = await JsonValidationHelper.validate(
        value,
        this.jsonRequestSchema.body
      );
    }

    if (!result.valid) {
      throw new BadRequestException(
        result.errors || 'The request has failed validation.'
      );
    }

    return value;
  }
}
