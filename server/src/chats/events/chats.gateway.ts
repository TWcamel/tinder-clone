import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

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
            map((item) => ({ event: 'events', data: item })),
        );
    }

    @SubscribeMessage('hello')
    async identity(@MessageBody() data: any): Promise<number> {
        console.log(data);
        this.server.on('connection', (socket) => {
            console.log('connected');
            socket.on('say to someone', (id, msg) => {
                return socket.to(id).emit('identity', msg);
            });
        });
        return this.server.listenerCount('connection');
    }

    @SubscribeMessage('message')
    async chatMessage(@MessageBody() message: string): Promise<string> {
        return message;
    }
}
