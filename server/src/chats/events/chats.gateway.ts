import { UseGuards, Logger } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import ArrayUtils from 'src/utils/array.utils';
import { ChatsService } from '../service/chats.service';

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
    constructor(private readonly chatsService: ChatsService) {}
    @WebSocketServer()
    private server: Server;
    private socket: Socket;
    private readonly logger = new Logger(ChatsGateway.name); //TODO: enable logger

    afterInit(server: Server): void {
        console.log(
            'Init gateway, the server can has max listeners up to: ',
            server.getMaxListeners(),
        );
    }

    handleConnection(@ConnectedSocket() client: Socket): void {
        this.removeOverlayConn(client);
        client.join(client.handshake.query.id);
    }

    handleDisconnect(@ConnectedSocket() client: Socket): void {
        client.to(client.id).emit('disconnect', client.id);
        console.log('Client disconnected', client.id);
    }

    @SubscribeMessage('send-message')
    async sendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() msgBody: { recipients: string[]; text: string },
    ): Promise<void> {
        // TODO: get chat id from matched id, and chat room id is the same as the matched id
        const clientId: string = await getClientId(client);
        const recipient =
            clientId === msgBody.recipients[0]
                ? msgBody.recipients[0]
                : clientId;
        const returnMessage: any = {
            text: msgBody.text,
            sender: clientId,
            recipients: [recipient],
        };
        const reciever =
            clientId === recipient ? msgBody.recipients[0] : clientId;
        // this.server.sockets.sockets.forEach((socket) => {
        //     if (
        //         socket.handshake.query.id !== clientId &&
        //         clientId === recipient
        //     ) {
        //         reciever = socket.id;
        //     }
        // });
        this.server.sockets.to(reciever).emit('receive-message', returnMessage);
    }

    removeOverlayConn(client: Socket): void {
        this.server.sockets.sockets.forEach((socket) => {
            if (
                socket.handshake.query.id === client.handshake.query.id &&
                socket.id !== client.id
            ) {
                socket.disconnect();
            }
        });
    }
}

const getClientId = async (socket: Socket): Promise<string> => {
    const id: any = socket.handshake.query.id;
    return id.length > 0 && !ArrayUtils.isArray(id) ? id : id[0];
};
