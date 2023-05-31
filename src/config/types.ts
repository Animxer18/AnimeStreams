import { RawAxiosRequestHeaders } from 'axios'

export type GETParamTypes = {
    url: string;
    token?: string;
    params?: Object;
    headers?: RawAxiosRequestHeaders
}