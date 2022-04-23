import { Request } from 'express';
import { UserI } from 'src/user/models/user.interface';

interface RequestWithUserI extends Request {
    user: UserI;
}

export default RequestWithUserI;
