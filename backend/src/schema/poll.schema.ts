import {Prop, raw, Schema, SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class Poll {
    @Prop({required: true})
    title: string;

    @Prop()
    description: string;

    @Prop(raw({
        year: Number,
        month: Number,
        day: Number,
    }))
    deadline: any;
}

export const PollSchema = SchemaFactory.createForClass(Poll);