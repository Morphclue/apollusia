import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class Poll {
    @Prop({required: true})
    title: string;

    description?: string;

    deadline?: any;
}

export const PollSchema = SchemaFactory.createForClass(Poll);