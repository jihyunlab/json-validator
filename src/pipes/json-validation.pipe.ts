import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import {
  RequestJsonSchema,
  JsonValidationResult,
} from '../interfaces/json-validation.interface';
import { JsonValidationHelper } from '../helpers/json-validation.helper';

export class JsonValidationPipe implements PipeTransform {
  constructor(private readonly requestJsonSchema: RequestJsonSchema) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata || !metadata.type) {
      return value;
    }

    let result: JsonValidationResult = {
      valid: true,
      message: 'The request has passed validation.',
    };

    if (metadata.type === 'param' && this.requestJsonSchema.parameter) {
      result = await JsonValidationHelper.validate(
        value,
        this.requestJsonSchema.parameter
      );
    }

    if (metadata.type === 'query' && this.requestJsonSchema.query) {
      result = await JsonValidationHelper.validate(
        value,
        this.requestJsonSchema.query
      );
    }

    if (metadata.type === 'body' && this.requestJsonSchema.body) {
      result = await JsonValidationHelper.validate(
        value,
        this.requestJsonSchema.body
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
