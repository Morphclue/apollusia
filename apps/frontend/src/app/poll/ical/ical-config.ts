import {Presentation} from '@mean-stream/ngbx';
import {IsBoolean, IsOptional, IsString} from 'class-validator';

export class ICalConfig {
  @Presentation({
    description: 'Custom title for the calendar. Replaces the poll title.',
  })
  @IsOptional()
  @IsString()
  customTitle?: string;

  @Presentation({
    description: 'Include events without participants in the calendar.',
  })
  @IsBoolean()
  emptyEvents = false;

  @Presentation({
    description: 'Only include booked events with participants in the calendar.',
  })
  @IsBoolean()
  onlyBookedEvents = false;
}
