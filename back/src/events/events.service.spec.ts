import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, Status, EventDocument } from './schemas/event.schemas';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('EventsServices', () => {
  let eventsService: EventsService;
  let spyModel: Model<EventDocument>;
  const events: Event[] = [
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
      startDate: new Date('2025-04-15T21:00:00.000+01:00'),
      endDate: new Date('2025-04-15T20:00:00.000+01:00'),
      status: Status.Next,
    },
  ];

  beforeEach(async () => {
    class EventModel {
      constructor(private data) {}
      static create = jest.fn();
      static find = jest.fn(() => {
        return {
          exec: jest.fn(() => events),
        };
      });
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: EventModel,
        },
      ],
    }).compile();
    eventsService = module.get<EventsService>(EventsService);
    spyModel = module.get<Model<EventDocument>>(getModelToken(Event.name));
  });

  describe('findAll', () => {
    it('should call method find when findAll is called', async () => {
      //act
      const result: Event[] = await eventsService.findAll();

      //assert
      expect(result).toBe(events);
      expect(spyModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should call method save when create is called', async () => {
      //arrange
      const eventDTO = {
        name: 'Meet-Up Green-It et accessibilité',
        description: 'Quels sont les outils que nous pouvons utiliser permettant avoir un ecosystème',
        startDate: new Date('2020-04-13T00:00:00.000+08:00'),
        endDate: new Date('2020-04-15T00:00:00.000+08:00'),
      };
      //act

      eventsService.create(eventDTO);

      //assert
      expect(spyModel.create).toHaveBeenCalledWith({
        ...eventDTO,
        status: 'PAST',
      });
    });
  });

  describe('getStatut', () => {
    it.each`
      startDate                                    | endDate                                      | expected
      ${new Date('2019-04-15T21:00:00.000+01:00')} | ${new Date('2019-04-15T21:00:00.000+01:00')} | ${'PAST'}
      ${new Date('2019-04-15T21:00:00.000+01:00')} | ${new Date('2021-04-15T21:00:00.000+01:00')} | ${'CURRENT'}
      ${new Date('2020-01-02T21:00:00.000+01:00')} | ${new Date('5000-04-15T21:00:00.000+01:00')} | ${'NEXT'}
    `('should return $expected when params startDate: $startDate and endDate: $endDate ', ({ startDate, endDate, expected }) => {
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01').getTime());

      expect(eventsService.getStatut({ startDate: startDate, endDate: endDate })).toEqual(expected);
      jest.useRealTimers();
    });
  });
});
