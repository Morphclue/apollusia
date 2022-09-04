export interface PollEvent {
  eventId?: string | number;
  title: string;
  start: Date;
  end?: Date;
  _id?: string;
}
