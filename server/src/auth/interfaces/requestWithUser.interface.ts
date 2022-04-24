import { Request } from 'express';
import { UserI } from 'src/user/models/user.interface';

export interface RequestWithUserI extends Request {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    password?: string;
}
