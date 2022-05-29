import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema()
export class Avatar {
    @Prop({
        required: true,
        index: true,
        trim: true,
    })
    email: string;

    @Prop({ required: true })
    url: string;

    @Prop({ required: true, default: new Date() })
    updateAt: Date;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
