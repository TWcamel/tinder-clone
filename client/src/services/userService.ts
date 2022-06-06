import { Api } from './api';
import AuthService from './authService';

const UserService = {
    getUserName: async (email: string) => {
        const response = await Api.get(`user/find`, {
            email: email.toString(),
        });
        return response.data.data;
    },

    updatePersonalInfo: async (email: string, password: string) => {
        const response = await Api.post(
            `user/info`,
            {
                email: email.toString(),
                password: password.toString(),
            },
            {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${AuthService.getBearerToken()}`,
            },
        );
        return response.data.data;
    },
};

export default UserService;
