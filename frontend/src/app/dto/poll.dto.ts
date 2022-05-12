import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export interface PollDto {
    title: string;
    description?: string;
    deadline?: NgbDateStruct;
    _id?: string;
}
