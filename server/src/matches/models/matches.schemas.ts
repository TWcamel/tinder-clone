import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MatchesDocument = Matches & Document;

@Schema()
export class Matches {
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
    matchedEmail: string;
}

export const MatchesSchema = SchemaFactory.createForClass(Matches);
