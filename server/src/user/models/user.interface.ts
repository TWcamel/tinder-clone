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
    bio?: string;
    memberShipType?: string;
}

export interface UserUpdateInfoI {
    email: string;
    bio: string;
}

export interface UserUpdatePwdI {
    email: string;
    password: string;
}
