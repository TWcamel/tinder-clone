export interface LikeI {
    id: string;
    email: string;
    matchEmail: string;
    isLiked: boolean;
    updateAt?: Date;
}

export interface FindLikedI {
    id: string;
}

export interface GetIdLikeI {
    email: string;
    matchEmail: string;
}

export interface FormatReturnMsgI {
    isLiked: boolean;
    updateAt?: Date;
    email: string;
    matchEmail: string;
}
