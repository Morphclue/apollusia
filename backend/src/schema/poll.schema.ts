import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class Poll {
    @Prop({required: true})
    title: string;

    @Prop()
    description: string;

    @Prop()
    deadline: string;
}

export const PollSchema = SchemaFactory.createForClass(Poll);