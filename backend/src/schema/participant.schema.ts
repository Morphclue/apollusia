import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import {Poll} from './poll.schema';

@Schema()
export class Participant {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Poll'})
    poll: Poll;

    @Prop({required: true})
    name: string;

    @Prop()
    participation: boolean[];
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
