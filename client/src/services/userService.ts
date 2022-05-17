import { Api } from './api';

const UserService = {
    getUserName: async (email: string) => {
        const response = await Api.get(`user/find`, {
            email: email.toString(),
        });
        return response.data.data;
    },
};

export default UserService;
