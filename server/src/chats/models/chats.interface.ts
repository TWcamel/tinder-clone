export interface ReceivedMessageI extends SenderAndRecieverI {
    message: string;
    updateAt: Date;
}

export interface MessagesI extends MessageI {
    user: string;
}

export interface ChatI extends MessageI {
    sender: string;
}

export interface SenderAndRecieverI {
    sender: string;
    reciever: string;
    fetch?: boolean;
}

export interface MessageI {
    message: string;
    updateAt: Date;
}
