export interface IpcRequest {
  responseChannel?: string;
  // params?: string[];
  params?: { [key: string]: string | boolean | number | any };
}
