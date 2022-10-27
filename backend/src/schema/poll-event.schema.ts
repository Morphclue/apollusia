import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class PollEvent {
  @Prop({required: true})
  start: string;

  @Prop({required: true})
  end: string;

  @Prop()
  note: string;
}

export const PollEventSchema = SchemaFactory.createForClass(PollEvent);
