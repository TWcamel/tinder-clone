export interface ChatI {
    messages: MessagesI[];
    updatedTime: Date;
}

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
