import {Presentation} from "@mean-stream/ngbx";
import {IsBoolean, IsOptional, IsString} from "class-validator";

export class ICalConfig {
  @Presentation({
    description: 'Custom title for the calendar. Replaces the poll title.',
  })
  @IsOptional()
  @IsString()
  customTitle?: string;

  @Presentation({
    label: 'Invite Participants as Attendees',
    description: 'Invite participants to the events. ' +
      'This will send an email to all participants with the calendar file attached. ' +
      'Only participants with a valid email address will be invited.',
  })
  @IsBoolean()
  inviteParticipants = false;
}
