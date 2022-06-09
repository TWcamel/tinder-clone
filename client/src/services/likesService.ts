import { Api } from './api';
import AuthService from './authService';

interface IChoice {
    like?: boolean;
    dislike?: boolean;
    superLike?: boolean;
}

const LikesService = {
    createLikesToken: async (
        email: string,
        recipientEmail: string,
        choice: IChoice,
    ) => {
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
