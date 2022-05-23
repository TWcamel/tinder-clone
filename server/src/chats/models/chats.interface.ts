export interface ReceivedMessageI {
    sender: string;
    reciever: string;
    message: string;
}

export interface MessagesI {
    message: string;
    updateAt: Date;
    user: string;
}

export interface ChatI {
    message: string;
    updateAt: Date;
    sender: string;
}
