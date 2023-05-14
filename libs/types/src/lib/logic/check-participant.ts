import type {Participant, Poll, PollEvent} from "@apollusia/types";
import {CreateParticipantDto} from "@apollusia/types";
import {DTO} from "@mean-stream/nestx";

export function checkParticipant(
  participant: Participant | DTO<Participant> | CreateParticipantDto | DTO<CreateParticipantDto>,
  poll: Poll | DTO<Poll>,
  otherParticipants: Participant[] | DTO<Participant>[],
): string[] | undefined {
  const problems: string[] = [];
  const isEdit = '_id' in participant;
  const {
    deadline,
    allowEdit,
    allowMaybe,
    maxParticipants,
    maxParticipantEvents,
    maxEventParticipants
  } = poll.settings || {};
  if (deadline && deadline < new Date()) {
    problems.push('deadline is over');
  }

  if (!allowEdit && isEdit) {
    problems.push('editing is not allowed');
  }

  if (!allowMaybe && Object.values(participant.selection).includes('maybe')) {
    problems.push('maybe is not allowed');
  }

  if (maxParticipants && otherParticipants.length >= maxParticipants && !isEdit) {
    problems.push('max participants reached');
  }

  if (maxParticipantEvents && Object.values(participant.selection).filter(e => e === 'yes').length > maxParticipantEvents) {
    problems.push('too many events selected');
  }

  if (maxEventParticipants) {
    for (const participation of Object.keys(participant.selection)) {
      if (participant.selection[participation] !== 'yes') {
        continue;
      }
      let count = 0;
      for (const otherParticipant of otherParticipants) {
        if (isEdit && otherParticipant._id.toString() === participant._id.toString()) {
          continue;
        }
        if (otherParticipant.selection[participation] === 'yes') {
          count++;
        }
      }
      if (count >= maxEventParticipants) {
        problems.push(`max participants for an event reached`);
      }
    }
  }


  return;
}
