import { Config } from '../config/config';
export const RequestApi = {
    backendBaseUrl: () => {
        return Config.SERVER_URL;
    },
};
