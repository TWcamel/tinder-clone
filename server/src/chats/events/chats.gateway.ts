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

interface ChatMessageI {
    text: string;
    recipients: string[];
}

interface FormattedMessageI extends ChatMessageI {
    sender: string;
    receiver: string;
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
        console.log('Client disconnected', client.id);
    }

    @SubscribeMessage('send-typing')
    async yourMatchIsTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() msgBody: ChatMessageI,
    ): Promise<void> {
        const clientId: string = await getClientId(client);
        const recipient = await this.getCorrectRecipient(
            clientId,
            msgBody.recipients[0],
        );
        const reciever =
            clientId === recipient ? msgBody.recipients[0] : clientId;

        console.log(reciever);

        this.server.sockets
            .to(reciever)
            .emit('receive-typing', `${clientId} is typing...`);
    }

    @SubscribeMessage('send-message')
    async sendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() msgBody: ChatMessageI,
    ): Promise<void> {
        const formattedMsg = await this.getFormattedMsg(client, msgBody);
        this.server.sockets
            .to(formattedMsg.receiver)
            .emit('receive-message', formattedMsg);
    }

    removeOverlayConn(client: Socket): void {
        this.server.sockets.sockets.forEach(async (socket) => {
            if (await ckeckIfTwoSocketsAreTheSame(socket, client))
                socket.disconnect();
        });
    }

    async getFormattedMsg(
        client: Socket,
        msgBody: ChatMessageI,
    ): Promise<FormattedMessageI> {
        const clientId: string = await getClientId(client);
        const recipient = await this.getCorrectRecipient(
            clientId,
            msgBody.recipients[0],
        );
        return {
            text: msgBody.text,
            sender: clientId,
            recipients: [recipient],
            receiver: clientId === recipient ? msgBody.recipients[0] : clientId,
        };
    }

    async getCorrectRecipient(
        clientId: string,
        recipientId: string,
    ): Promise<string> {
        return clientId === recipientId ? recipientId : clientId;
    }
}

const getClientId = async (socket: Socket): Promise<string> => {
    const id: any = socket.handshake.query.id;
    return id.length > 0 && !ArrayUtils.isArray(id) ? id : id[0];
};

const ckeckIfTwoSocketsAreTheSame = async (
    socket1: Socket,
    socket2: Socket,
): Promise<boolean> => {
    return (
        (await getClientId(socket1)) === (await getClientId(socket2)) &&
        socket1.id !== socket2.id
    );
};
