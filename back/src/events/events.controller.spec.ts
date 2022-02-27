import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventDto } from './dto/event.dto';
import { Event, Status } from './schemas/event.schemas';
import { getModelToken } from '@nestjs/mongoose';

describe('EventsController', () => {
  let eventsController: EventsController;
  let eventsService: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: {},
        },
      ],
    }).compile();

    eventsController = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      //arrange
      const expectedEvents: Event[] = [
        {
          name: 'Meet-Up Green-It et accessibilité',
          description: 'Quels sont les outils que nous pouvons utiliser permettant avoir un ecosystème',
          startDate: new Date('2020-04-13T00:00:00.000+08:00'),
          endDate: new Date('2020-04-15T00:00:00.000+08:00'),
          status: Status.Past,
        },
        {
          name: 'Meet-Up VueJS',
          description: 'Nous allons voir comment créer un site todo',
          startDate: new Date('2025-04-15T21:00:00.000+08:00'),
          endDate: new Date('2025-04-15T20:00:00.000+08:00'),
          status: Status.Next,
        },
      ];

      jest.spyOn(eventsService, 'findAll').mockResolvedValue(expectedEvents);

      //act
      const result: Event[] = await eventsController.findAll();

      //assert
      expect(eventsService.findAll).toHaveBeenCalled();
      expect(result).toBe(expectedEvents);
    });
  });
  describe('create', () => {
    it('should create an event', async () => {
      //arrange
      const eventDto: EventDto = {
        name: 'Meet-Up Green-It et accessibilité',
        description: 'Quels sont les outils que nous pouvons utiliser permettant avoir un ecosystème',
        startDate: new Date('2020-04-13T00:00:00.000+08:00'),
        endDate: new Date('2020-04-15T00:00:00.000+08:00'),
      };
      jest.spyOn(eventsService, 'create');

      //act
      await eventsController.create(eventDto);

      //assert
      expect(eventsService.create).toHaveBeenCalledWith(eventDto);
    });
  });
});
