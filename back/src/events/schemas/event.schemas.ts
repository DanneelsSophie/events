import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type EventDocument = Event & Document;

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
}

export const EventSchema = SchemaFactory.createForClass(Event);
