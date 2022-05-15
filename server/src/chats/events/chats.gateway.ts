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

interface ChatMessageI {
    message: string;
    sender: string;
    recipient: string;
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatsGateway {
    @WebSocketServer()
    private server: Server;

    @SubscribeMessage('events')
    findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
        return from([1, 2, 3]).pipe(
            map((item) => ({ event: 'events', item: item, data: data })),
        );
    }

    @SubscribeMessage('hello')
    async identity(@MessageBody() data: any): Promise<number> {
        // console.log(data);
        this.server.on('connection', (socket) => {
            // console.log('connected');
            socket.on('say to someone', (id, msg) => {
                console.log(id, msg);
                return socket.to(id).emit('identity', { msg, id });
            });
        });
        return this.server.listenerCount('connection');
    }

    @SubscribeMessage('message')
    async chatMessage(@MessageBody() message: string): Promise<string> {
        return message;
    }

    @SubscribeMessage('send-message')
    async sendMessage(
        @MessageBody() msgBody: { recipient: string; message: string },
        @ConnectedSocket() client: Socket,
    ): Promise<boolean> {
        const clientId: string = await getClientId(client);
        this.server.socketsJoin(clientId);
        console.log(clientId);
        const returnMessage: ChatMessageI = {
            message: msgBody.message,
            sender: msgBody.recipient,
            recipient: clientId,
        };
        const res = this.server
            .to(msgBody.recipient)
            .emit('receive-message', returnMessage);
        console.log(res);
        return res;
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
