import {PollLog} from '@apollusia/types';
import {EventRepository} from '@mean-stream/nestx';
import {Doc} from '@mean-stream/nestx/ref';
import {MongooseRepository} from '@mean-stream/nestx/resource';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {filter, Observable, Subject} from 'rxjs';

@Injectable()
@EventRepository()
export class PollLogService extends MongooseRepository<PollLog> {
  // FIXME this only works on a single server instance.
  //   To make it work on multiple instances, we need to use Nats and EventService.
  private readonly events = new Subject<PollLog>();

  constructor(
    @InjectModel(PollLog.name) model: Model<PollLog>,
  ) {
    super(model);
  }

  emit(event: string, data: Doc<PollLog>) {
    // this.eventService.emit(`polls.${data.poll}.log.${data._id}.${event}`, data);
    this.events.next(data.toObject());
  }

  subscribe(poll: Types.ObjectId): Observable<PollLog> {
    // return this.eventService.subscribe(`polls.${poll}.log.*.*`);
    return this.events.pipe(
      filter(log => poll.equals(log.poll)),
    );
  }
}
