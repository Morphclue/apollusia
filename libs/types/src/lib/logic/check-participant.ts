import type {CreateParticipantDto, ReadParticipantDto, ReadPollDto, UpdateParticipantDto} from "@apollusia/types";
import {DTO} from "@mean-stream/nestx";
import type {Types} from "mongoose";

export function checkParticipant(
  participant: CreateParticipantDto | DTO<CreateParticipantDto> | UpdateParticipantDto | DTO<UpdateParticipantDto>,
  poll: ReadPollDto | DTO<ReadPollDto>,
  otherParticipants: ReadParticipantDto[] | DTO<ReadParticipantDto>[],
  edit?: string | Types.ObjectId,
): string[] {
  const problems: string[] = [];
  const {
    deadline,
    anonymous,
    allowEdit,
    allowMaybe,
    maxParticipants,
    maxParticipantEvents,
    maxEventParticipants
  } = poll.settings || {};
  if (deadline && deadline < new Date()) {
    problems.push('deadline is over');
  }

  if (!anonymous && !edit && !(participant as any).name) {
    problems.push('name is required');
  }

  if (!allowEdit && edit) {
    problems.push('editing is not allowed');
  }

  if (!allowMaybe && Object.values(participant.selection).includes('maybe')) {
    problems.push('maybe is not allowed');
  }

  if (maxParticipants && otherParticipants.length >= maxParticipants && !edit) {
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
        if (edit && otherParticipant._id.toString() === edit.toString()) {
          continue;
        }
        if (otherParticipant.selection[participation] === 'yes') {
          count++;
        }
      }
      if (count >= maxEventParticipants) {
        problems.push('max participants for an event reached');
      }
    }
  }

  return problems;
}
