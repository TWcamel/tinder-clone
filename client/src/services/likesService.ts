import { Api } from './api';
import AuthService from './authService';

const LikesService = {
    createLikesToken: async (email: string, recipientEmail: string) => {
        const payload = JSON.stringify({
            user: email,
            recipient: recipientEmail,
            isLiked: true,
        });
        const response = await Api.post(`likes`, payload, {
            Authorization: `Bearer ${AuthService.getBearerToken()}`,
        });
        return response.data;
    },
};

export default LikesService;
