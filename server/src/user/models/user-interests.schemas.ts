import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InterestDocument = Interest & Document;

@Schema()
export class Interest {
    @Prop({ required: true, unique: true, index: true, dropDups: true })
    id: string;

    @Prop({ required: true })
    gender: string;

    @Prop({ required: true })
    ageRange: number[];

    @Prop({ required: true, default: new Date() })
    updateAt: Date;
}

export const InterestsSchema = SchemaFactory.createForClass(Interest);
