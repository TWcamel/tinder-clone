import { Api } from './api';
import AuthService from './authService';

const ChatService = {
    getChat: async (chatId: string) => {
        const response = await Api.get(`/chats/${chatId}`);
        return response.data;
    },

    getChatsHistory: async ({
        sender,
        reciever,
    }: {
        sender: string;
        reciever: string;
    }) => {
        const response = await Api.post(
            'chats/history',
            { sender, reciever },
            {
                authorization: `Bearer ${AuthService.getBearerToken()}`,
            },
        );

        return response.data;
    },
};

export default ChatService;
