export interface LikeI {
    id: string;
    email: string;
    matchEmail: string;
    isLiked: boolean;
    updatedAt?: Date;
}

export interface FindLikedI {
    id: string;
}

export interface GetIdLikeI {
    email: string;
    matchEmail: string;
}
