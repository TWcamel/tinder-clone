export interface S3BucketI {
    user: string;
    image: Blob;
    img_name: string;
    url: string;
}

export interface AvatarI {
    user: string;
    url: string;
}

export interface AvatarsI {
    email: string;
    url: string;
    updateAt: Date;
}
