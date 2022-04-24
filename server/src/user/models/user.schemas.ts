import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop({ required: true, unique: true, index: true, dropDups: true })
    email: string;

    @Prop()
    password: string;
    
    @Prop()
    googleId: string;

    @Prop()
    facebookId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
