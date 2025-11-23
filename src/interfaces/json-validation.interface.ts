export interface JsonRequestSchema {
  parameter?: object;
  query?: object;
  body?: object;
}

export interface JsonValidationResult {
  valid: boolean;
  message: string;
  errors?: object[];
}
