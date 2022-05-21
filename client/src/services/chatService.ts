import { Api } from './api';

const ChatService = {
    getChat: async (chatId: string) => {
        const response = await Api.get(`/chats/${chatId}`);
        return response.data;
    },

    createNewMatch: async (userId: string) => {},
};

export default ChatService;
