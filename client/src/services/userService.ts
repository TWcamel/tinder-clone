import { Api } from './api';
import AuthService from './authService';
import AwsService from './awsService';

interface IUserInfo {
    email: string;
    bio: string;
}

const UserService = {
    getUserName: async (email: string) => {
        const response = await Api.get(`user/find`, {
            email: email.toString(),
        });
        return response.data.data;
    },

    updatePassword: async (email: string, password: string) => {
        const response = await Api.post(
            `user/password`,
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

    updatePersonalInfo: async (info: IUserInfo) => {
        const response = await Api.post(`user/info`, info, {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AuthService.getBearerToken()}`,
        });
        return response.data.data;
    },

    getUserInfo: async (email: string) => {
        const response = await Api.get(`user/people/${email}`, null, {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AuthService.getBearerToken()}`,
        });
        return response.data;
    },

    
};

export default UserService;
