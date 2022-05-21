import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MessagesI } from './chats.interface';

export type ChatsDocument = Chats & Document;

@Schema()
export class Chats extends Document {
    @Prop({ required: true, index: true })
    matchedId: string;

    @Prop({ required: true, default: Date.now() })
    updatedAt: Date;

    @Prop({ required: true })
    chatContext: MessagesI[];
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
