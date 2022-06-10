import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import DateTimeUtils from 'src/utils/time.utils';

export type NextTimeToMatchDocument = NextTimeToMatch & Document;

@Schema()
export class NextTimeToMatch {
    @Prop({
        required: true,
        unique: true,
        index: true,
        trim: true,
    })
    email: string;

    @Prop({ required: true, default: DateTimeUtils.tomorrow() })
    nextTime: string;
}

export const NextTimeToMatchSchema =
    SchemaFactory.createForClass(NextTimeToMatch);
