import { Api } from './api';

interface IUser {
    name: string;
    email: string;
    password: string;
    gender: string;
    age: number;
}

const SignupService = {
    signup: async (user: IUser) => {
        const response = await Api.post('user', user);
        return response.data;
    },
};

export default SignupService;
