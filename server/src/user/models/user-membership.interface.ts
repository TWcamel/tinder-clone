import { UserI } from './user.interface';

export interface UserMembershipI extends UserI {
    membershipType: string;
}
