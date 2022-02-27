import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schemas';
import { Event } from './schemas/event.schemas';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
})
export class EventsModule {}
