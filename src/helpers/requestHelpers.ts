// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { devLog } from "./functionHelpers";
import networkErrorNotification from "../components/NetworkError";

export enum ReqMethods {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export async function request(
  url: string,
  method: ReqMethods,
  data: Record<string, string> = {},
  options?: RequestInit & AxiosRequestConfig<RequestInit>
) {
  try {
    const res = await axios[method](url, data, options);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  } catch (e: AxiosError) {
    devLog(`Req:Error ${url} call`, { e });
    networkErrorNotification(e.response.status);
  }
}
