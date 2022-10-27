import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose from 'mongoose';

import {Settings} from '../dto';
import {PollEvent} from './poll-event.schema';

@Schema()
export class Poll {
    @Prop({required: true})
    title: string;

    @Prop()
    description: string;

    @Prop()
    location: string;

    @Prop({required: true})
    adminToken: string;

    @Prop({Settings})
    settings: Settings;

    @Prop({
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PollEvent',
        }],
    })
    bookedEvents: PollEvent[];
}

export const PollSchema = SchemaFactory.createForClass(Poll);
