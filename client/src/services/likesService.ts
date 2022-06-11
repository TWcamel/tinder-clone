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
        choice: boolean,
    ) => {
        const payload = JSON.stringify({
            user: email,
            recipient: recipientEmail,
            isLiked: choice,
        });
        let response = await Api.post(`likes`, payload, {
            Authorization: `Bearer ${AuthService.getBearerToken()}`,
        });

        return response;
    },

    getRemainTimeNextSwipe: async (email: string) => {
        const response = await Api.get(`matches/nextSwipe/${email}`, {
            Authorization: `Bearer ${AuthService.getBearerToken()}`,
        });
        return response.data;
    },
};

export default LikesService;
