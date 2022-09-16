import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import {Poll} from './poll.schema';
import {PollEvent} from './poll-event.schema';

@Schema()
export class Participant {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Poll'})
    poll: Poll;

    @Prop({required: true})
    name: string;

    @Prop({
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PollEvent',
        }],
    })
    participation: PollEvent[];

    @Prop({
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PollEvent',
        }],
    })
    indeterminateParticipation: PollEvent[];

    @Prop({required: true})
    token: string;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
