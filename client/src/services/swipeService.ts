import { Api } from './api';
import AuthService from './authService';

const SwipeService = {
    getSwipes: async (email: string) => {
        const response = await Api.get(`likes/${email}`, null, {
            Authorization: `Bearer ${AuthService.getBearerToken()}`,
        });
        return response.data;
    },
};

export default SwipeService;
