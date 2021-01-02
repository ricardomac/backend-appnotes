export class ApiResponseResult {
  constructor(
    public success: boolean,
    public message?: string,
    public data?: any,
  ) {}
}
