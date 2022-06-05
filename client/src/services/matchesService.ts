import { Api } from './api';
import AuthService from './authService';

const MatchesService = {
    createMatchPair: async (email: string, recipientEmail: string) => {
        const payload = JSON.stringify({
            user: email,
            recipient: recipientEmail,
        });
        const response = await Api.post(`matches`, payload, {
            Authorization: `Bearer ${AuthService.getBearerToken()}`,
        });
        return response.data;
    },

    getMatches: async (email: string) => {
        const response = await Api.get(
            `matches/${email}`,
            {},
            {
                Authorization: `Bearer ${AuthService.getBearerToken()}`,
            },
        );
        return response.data;
    },
};

export default MatchesService;
