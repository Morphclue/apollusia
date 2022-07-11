import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

import {PollEvent} from '../dto/poll-event.dto';
import {Settings} from '../dto/settings';

@Schema()
export class Poll {
    @Prop({required: true})
    title: string;

    @Prop()
    description: string;

    @Prop({Settings})
    settings: Settings;

    @Prop([PollEvent])
    events: PollEvent[];
}

export const PollSchema = SchemaFactory.createForClass(Poll);
