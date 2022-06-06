export interface UserI {
    id?: number;
    name: string;
    email: string;
    gender?: string;
    password?: string;
    facebookId?: string;
    googleId?: string;
    token?: string;
    avatar?: string[];
}

export interface UserUpdateInfoI {
    email: string;
    password: string;
}
