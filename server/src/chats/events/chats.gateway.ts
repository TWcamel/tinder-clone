import { UseGuards, Logger } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

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
export class ChatsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    private server: Server;
    private socket: Socket;
    private readonly logger = new Logger(ChatsGateway.name);

    afterInit(server: Server): void {
        console.log(
            'Init gateway, the server can has max listeners up to: ',
            server.getMaxListeners(),
        );
    }

    @UseGuards(JwtAuthGuard)
    handleConnection(@ConnectedSocket() client: Socket): void {
        console.log('Client connected', client.id);
    }

    handleDisconnect(@ConnectedSocket() client: Socket): void {
        console.log('Client disconnected', client.id);
    }

    @SubscribeMessage('send-message')
    async sendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() msgBody: { recipients: object[]; text: string },
    ): Promise<void> {
        // TODO: auth verrification before sending messages
        console.log(client.handshake.headers);
        const clientId: any = await getClientId(client);
        const recipients: any = msgBody.recipients;
        console.log(recipients);
        recipients.forEach(async (recipient: RecipientI) => {
            const newRecipients = recipients.filter(
                (r: string) => r !== recipient.id,
            );
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
