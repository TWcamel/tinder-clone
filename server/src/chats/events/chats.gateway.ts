import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    ConnectedSocket,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';

interface RecipientI {
    id: string;
    name: string;
}

interface ChatMessageI {
    text: string;
    sender: string;
    recipients: RecipientI[];
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatsGateway {
    @WebSocketServer()
    private server: Server;
    private socket: Socket;

    @SubscribeMessage('send-message')
    async sendMessage(
        @MessageBody() msgBody: { recipients: object[]; text: string },
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        const clientId: any = await getClientId(client);
        const recipients: any = msgBody.recipients;
        recipients.forEach(async (recipient: RecipientI) => {
            const newRecipients = recipients.filter((r) => r !== recipient);
            newRecipients.push(clientId);
            const returnMessage: ChatMessageI = {
                text: msgBody.text,
                sender: clientId,
                recipients: newRecipients,
            };
            this.server.socketsJoin(clientId);
            this.server.sockets
                .to([recipient.toString(), clientId])
                .emit('receive-message', returnMessage);
        });
    }
}

const getClientId = async (socket: Socket): Promise<string> => {
    const id: any = socket.handshake.query.id;
    return socket.handshake.query.id.length > 0 &&
        !isArray(socket.handshake.query.id)
        ? id
        : id[0];
};

const isArray = (value: any): boolean => {
    return value && typeof value === 'object' && value.constructor === Array;
};
