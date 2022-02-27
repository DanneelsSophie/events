import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type EventDocument = Event & Document;

export enum Status {
  Past = 'PAST',
  Current = 'CURRENT',
  Next = 'NEXT',
}

@Schema()
export class Event {
  @ApiProperty({
    description: "Le nom de l'évènement",
    type: String,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: "La description de l'évènement",
    type: String,
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: "Le début de la date de l'évènement",
    type: Date,
  })
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty({
    description: "La fin de la date de l'évènement",
    type: Date,
  })
  @Prop({ required: true })
  endDate: Date;

  @ApiProperty({
    description: "Le status de l'évènement",
    enum: ['PAST', 'CURRENT', 'FUTUR'],
  })
  @Prop({ required: true, enum: Status })
  status: Status;
}

export const EventSchema = SchemaFactory.createForClass(Event);
