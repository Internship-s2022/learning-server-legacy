export class CustomError {
  status!: number;
  message!: string;
  data!: any;

  constructor(status = 500, message: string, data: any) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
