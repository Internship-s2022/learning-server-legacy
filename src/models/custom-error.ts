export class CustomError {
  status!: number;
  message!: string;
  data?: undefined | Record<string, unknown>;

  constructor(
    status = 500,
    message: string,
    data: undefined | Record<string, unknown> = undefined,
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
