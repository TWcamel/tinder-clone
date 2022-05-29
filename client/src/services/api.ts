import axios from 'axios';
import Config from '../config/config';

interface IApi {
    get: (url: string, _params?: any) => Promise<any>;
    post: (url: string, data: any, headers?: any) => Promise<any>;
    delete: (url: string) => Promise<any>;
    patch: (url: string, data: any, headers?: any) => Promise<any>;
    put: (url: string, data: any, headers?: any) => Promise<any>;
    s3Request: (url: string, data: any, headers?: any) => Promise<any>;
    s3RequestGet: (url: string, query: object) => Promise<any>;
    backendUrl: string;
}

export const Api: IApi = {
    backendUrl: Config.SERVER_API_URL,
    get: async (url: string, _params?: any) => {
        return axios.get(`${Api.backendUrl}/${url}`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            withCredentials: true,
            params: _params,
        });
    },
    post: async (url: string, data: any, headers?: any) =>
        axios.post(`${Api.backendUrl}/${url}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                ...headers,
            },
            withCredentials: true,
        }),
    delete: async (url: string) =>
        axios.delete(`${Api.backendUrl}/${url}`, {
            headers: { 'Content-Type': 'application/json' },
        }),
    patch: async (url: string, data: any, headers?: any) =>
        axios.patch(`${Api.backendUrl}/${url}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                ...headers,
            },
            withCredentials: true,
        }),
    put: async (url: string, data: any, headers?: any) =>
        axios.put(`${Api.backendUrl}/${url}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                ...headers,
            },
            withCredentials: true,
        }),
    s3Request: async (url: string, data: any, headers?: any) =>
        axios.post(
            `${Api.backendUrl}/${url}`,
            { ...data, url: `${Config.APIGW_S3_BUCKET_ADDR}/${data.img_name}` },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    ...headers,
                },
                withCredentials: true,
            },
        ),
    s3RequestGet: async (url: string, query: object) =>
        axios.get(`${Api.backendUrl}/${url}`, {
            params: query,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            withCredentials: true,
        }),
};
