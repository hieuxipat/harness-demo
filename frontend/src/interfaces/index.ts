export interface IResponseInfo {
  msg: string;
  state: number;
}
export interface IResponse<T> extends IResponseInfo {
  data: T;
}
