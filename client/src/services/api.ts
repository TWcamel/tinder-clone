import axios from 'axios';
import Config from '../config/config';

interface IApi {
    get: (url: string) => Promise<any>;
    post: (url: string, data: any, headers?: any) => Promise<any>;
    delete: (url: string) => Promise<any>;
    patch: (url: string, data: any, headers?: any) => Promise<any>;
    backendUrl: string;
}

export const Api: IApi = {
    backendUrl: Config.SERVER_API_URL,
    get: async (url: string) =>
        axios.get(`${Api.backendUrl}/${url}`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            withCredentials: true,
        }),
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
};
