import { IsString, MaxLength, IsDate, IsNotEmpty, MinDate, MaxDate } from 'class-validator';
import { IsBefore } from '../validators/is-before';
import { IsNotBlank } from '../validators/is-not-blank';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class EventDto {
  @ApiProperty({
    description: "Le nom de l'évènement",
    type: String,
    minLength: 1,
    maxLength: 32,
    required: true,
  })
  @IsString()
  @IsNotBlank()
  @MaxLength(32, {
    message: 'Le nom est trop long',
  })
  @IsNotEmpty({ message: 'Le nom ne peut pas être vide' })
  readonly name: string;

  @IsString()
  @IsNotBlank()
  @MaxLength(200, {
    message: 'La description ne doit pas dépasser 200 caractères',
  })
  @IsNotEmpty({ message: 'La description ne peut pas être vide' })
  @ApiProperty({
    description: "La description de l'évènement",
    type: String,
    minLength: 1,
    maxLength: 200,
    required: true,
  })
  readonly description: string;

  @ApiProperty({
    description: "Le début de la date de l'évènement",
    type: Date,
    required: true,
  })
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date('01/01/1900'))
  @MaxDate(new Date('01/01/2200'))
  @IsBefore('endDate')
  readonly startDate: Date;

  @ApiProperty({
    description: "La fin de la date de l'évènement",
    type: Date,
    required: true,
  })
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date('01/01/1900'))
  @MaxDate(new Date('01/01/2200'))
  readonly endDate: Date;
}
