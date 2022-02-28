import { Injectable } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { Event, EventDocument } from './schemas/event.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  async create(eventDto: EventDto) {
    this.eventModel.create({
      ...eventDto,
    });
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find({}, '-__v').exec();
  }
}
