export class HttpError extends Error {
  public status: number;
  public message: string;

  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
