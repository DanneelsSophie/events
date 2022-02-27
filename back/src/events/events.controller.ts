import { Controller, Post, Get, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventDto } from './dto/event.dto';
import { Event } from './schemas/event.schemas';
import { ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@Controller({
  version: '1',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('events')
  @ApiCreatedResponse({
    description: "L'évènement a bien été ajouté avec succès",
  })
  @ApiBadRequestResponse({
    description: "L'évènement qui a voulu êre rajouté ne correspond pas au modèle",
  })
  async create(@Body() eventDto: EventDto) {
    this.eventsService.create(eventDto);
  }

  @Get('events')
  @ApiOkResponse({
    description: 'La liste des évènements est affichée',
    type: Event,
    isArray: true,
  })
  async findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }
}
