# @jihyunlab/json-validator

[![Version](https://img.shields.io/npm/v/@jihyunlab/json-validator.svg?style=flat-square)](https://www.npmjs.com/package/@jihyunlab/json-validator?activeTab=versions) [![Downloads](https://img.shields.io/npm/dt/@jihyunlab/json-validator.svg?style=flat-square)](https://www.npmjs.com/package/@jihyunlab/json-validator) [![Last commit](https://img.shields.io/github/last-commit/jihyunlab/json-validator.svg?style=flat-square)](https://github.com/jihyunlab/json-validator/graphs/commit-activity) [![License](https://img.shields.io/github/license/jihyunlab/json-validator.svg?style=flat-square)](https://github.com/jihyunlab/json-validator/blob/master/LICENSE) [![Linter](https://img.shields.io/badge/linter-eslint-blue?style=flat-square)](https://eslint.org) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)\
[![Build](https://github.com/jihyunlab/json-validator/actions/workflows/build.yml/badge.svg)](https://github.com/jihyunlab/json-validator/actions/workflows/build.yml) [![Lint](https://github.com/jihyunlab/json-validator/actions/workflows/lint.yml/badge.svg)](https://github.com/jihyunlab/json-validator/actions/workflows/lint.yml)

@jihyunlab/json-validator was developed based on JSON schema and ajv to make configuring NestJS validation pipes easier and more convenient. @jihyunlab/json-validator also provides a separate validation helper that can be used even outside of a NestJS environment.

## Installation

```bash
npm i @jihyunlab/json-validator
```

## Usage

JSON schemas are defined for request validation. Depending on how the controller receives the request data, JSON schemas can be configured for the query, parameter, and body.

```
import { RequestJsonSchema } from '@jihyunlab/json-validator';

export const UserJsonSchema: Record<'find' | 'findOne', RequestJsonSchema> = {
  find: {
    query: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          pattern: '^[^\\s][\\s\\S]{0,}$',
        },
      },
      required: ['name'],
    },
  },
  findOne: {
    parameter: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          pattern: '^[\\w.-]+@jihyunlab\\.com$',
        },
      },
      required: ['email'],
    },
  },
};
```

A validation pipe can be easily implemented by using the JSON schema defined in the NestJS controller.

```
import { JsonValidationPipe } from '@jihyunlab/json-validator';
import { UserJsonSchema } from '../json-schemas/user.json-schema';

@Controller('/user')
export class UserController {
  constructor() {}

  @Get()
  @UsePipes(new JsonValidationPipe(UserJsonSchema.find))
  async find(
    @Query()
    query: {
      name: string;
    },
    @Res() response: Response
  ) {...}
  ...
}
```

If validation fails in the validation pipe, the error produced by ajv is returned as an HTTP response.

```
{
  "message": [
    {
      "instancePath": "/name",
      "schemaPath": "#/properties/name/pattern",
      "keyword": "pattern",
      "params": {
        "pattern": "^[^\\s][\\s\\S]{0,}$"
      },
      "message": "must match pattern \"^[^\\s][\\s\\S]{0,}$\""
    }
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

JsonValidationHelper allows you to easily validate requests even when you are not in a NestJS environment.

```
import { JsonValidationHelper } from '@jihyunlab/json-validator';
import { UserJsonSchema } from '../json-schemas/user.json-schema';

const result = await JsonValidationHelper.validate(
  query,
  UserJsonSchema.find.query || {}
);
```

```
{
  "valid": true,
  "message": "The validation was passed."
}
```

If validation fails, the returned response includes the errors.

```
{
  "valid": false,
  "message": "The validation has failed.",
  "errors": [
    {
      "instancePath": "/name",
      "schemaPath": "#/properties/name/pattern",
      "keyword": "pattern",
      "params": {
        "pattern": "^[^\\s][\\s\\S]{0,}$"
      },
      "message": "must match pattern \"^[^\\s][\\s\\S]{0,}$\""
    }
  ]
}
```

JsonValidationHelper allows you to easily validate individual values.

```
const result = await JsonValidationHelper.validate(query.name, {
  type: 'string',
  pattern: '^[^\\s][\\s\\S]{0,}$',
});
```

## Credits

Authored and maintained by JihyunLab <<info@jihyunlab.com>>

## License

Open source [licensed as MIT](https://github.com/jihyunlab/json-validator/blob/master/LICENSE).
