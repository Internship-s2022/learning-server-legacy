export interface ResponseBody<T> {
  message: string;
  data: T;
  error: boolean;
}
