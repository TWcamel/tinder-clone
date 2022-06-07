import { Api } from './api';
import AuthService from './authService';

interface IInterests {
    gender: string;
    ageRange: number[];
    location: string;
}

const SignupService = {
    update: async (user: IInterests, email: string) => {
        const response = await Api.post(`user/interests/${email}`, user, {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AuthService.getBearerToken()}`,
        });
        return response.data;
    },
    check: async (email: string) => {
        const response = await Api.get(`user/interests/${email}`, null ,{
            Authorization: `Bearer ${AuthService.getBearerToken()}`,
        });
        return response.data;
    },
};

export default SignupService;
