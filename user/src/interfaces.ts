export interface IApiError {
  code: number;
  type: string;
  message: string;
}

export interface ISwaggerClient {
  api(operationId: string, payload: object): Promise<object>;
}
