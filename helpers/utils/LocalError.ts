interface LocalHttpError {
  message: string;
  statusCode: number;
  [key: string]: any;
}

export class LocalError implements LocalHttpError {
  message: string;
  statusCode: number;
  errors?: any;
  constructor(message: string, code: number, errors: any) {
    this.message = message;
    this.statusCode = code;
    this.errors = errors;
  }
}
