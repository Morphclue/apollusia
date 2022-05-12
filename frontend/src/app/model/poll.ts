import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export interface Poll {
  title: string;
  description?: string;
  deadline?: NgbDateStruct;
  _id: string;
}
