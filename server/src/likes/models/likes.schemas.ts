import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LikesDocument = Likes & Document;

@Schema()
export class Likes {
    @Prop({
        required: true,
        unique: true,
        index: true,
        trim: true,
    })
    id: string;

    @Prop({ required: true, index: true })
    email: string;

    @Prop({ required: true })
    matchEmail: string;

    @Prop({ required: true })
    isLiked: boolean;

    @Prop({ required: true, default: new Date() })
    updatedAt: Date;
}

export const LikesSchema = SchemaFactory.createForClass(Likes);
