import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MessagesI } from './chats.interface';

export type ChatsDocument = Chats & Document;

@Schema()
export class Chats extends Document {
    @Prop({ required: true, index: true })
    matchedId: string;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true, default: Date.now() })
    sender: string;

    @Prop({ required: true, default: Date.now() })
    updateAt: Date;
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
