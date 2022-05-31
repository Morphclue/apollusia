import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

import {PollEvent} from '../dto/poll-event.dto';

@Schema()
export class Poll {
    @Prop({required: true})
    title: string;

    @Prop()
    description: string;

    @Prop()
    deadline: string;

    @Prop([PollEvent])
    events: PollEvent[];
}

export const PollSchema = SchemaFactory.createForClass(Poll);