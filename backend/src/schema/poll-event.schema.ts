import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';

import {Poll} from './poll.schema';

@Schema()
export class PollEvent {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Poll'})
    poll: Poll;

    @Prop({required: true})
    start: string;

    @Prop({required: true})
    end: string;

    @Prop()
    note: string;
}

export const PollEventSchema = SchemaFactory.createForClass(PollEvent);
