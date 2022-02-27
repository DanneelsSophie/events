import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EventsModule } from '../src/events/events.module';
import * as request from 'supertest';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '../src/pipes/validation.pipe';
import { Connection } from 'mongoose';
import { Status, Event } from '../src/events/schemas/event.schemas';
import { ConfigModule } from '@nestjs/config';

const featureCreate = loadFeature('./test/event-create.feature');
const featureAffichage = loadFeature('./test/events-affichage.feature');

describe('app - EventsController (e2e)', () => {
  let app: INestApplication;

  afterAll(async () => {
    await app.close();
    await (app.get(getConnectionToken()) as Connection).close();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EventsModule, ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGO_TEST_CONNECTION_URI)],
      providers: [
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        },
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const database = (app.get(getConnectionToken()) as Connection).db;
    await database.dropDatabase();
  });

  defineFeature(featureCreate, test => {
    let createAnEvent;

    const ObjectCreatedEvents = {
      'Meet-Up Green-It': {
        name: 'Meet-Up Green-It',
        description: 'Quels sont les outils que nous pouvons utiliser permettant avoir un ecosystème',
        startDate: new Date('2010-04-13T00:00:00.000+08:00'),
        endDate: new Date('2010-04-15T00:00:00.000+08:00'),
        status: Status.Past,
      },
      'evenement futur': {
        name: 'evenement futur',
        description: 'Quels sont les outils que nous pouvons utiliser permettant avoir un ecosystème',
        startDate: new Date('2199-04-13T00:00:00.000+08:00'),
        endDate: new Date('2199-04-15T00:00:00.000+08:00'),
        status: Status.Next,
      },
      'evenement current': {
        name: 'evenement current',
        description: 'Quels sont les outils que nous pouvons utiliser permettant avoir un ecosystème',
        startDate: new Date('2000-04-13T00:00:00.000+08:00'),
        endDate: new Date('2199-04-15T00:00:00.000+08:00'),
        status: Status.Current,
      },
      a1234567890123456789012345678901: {
        name: 'a1234567890123456789012345678901',
        description:
          'Le lorem ipsum (également appelé faux-texte, lipsum, ou bolo bolo1) est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte défiee',
        startDate: new Date('2010-04-13T00:00:00.000+08:00'),
        endDate: new Date('2010-04-15T00:00:00.000+08:00'),
        status: Status.Past,
      },
    };

    test("la création d'un évènement avec succès", ({ given, when, then }) => {
      given('je suis un utilisateur', () => {
        //jest.useFakeTimers().setSystemTime(new Date('2020-01-01').getTime());
      });

      when('je décide de créer un évènement:', table => {
        const event = table.map(event => {
          return {
            ...event,
            name: event.name.replace('"', '').replace('"', ''),
            description: event.description.replace('"', '').replace('"', ''),
          };
        })[0];
        createAnEvent = request(app.getHttpServer()).post('/events').send(event);
      });
      then(/^l'évènement a bien été ajouté (.*)$/, async nameEvent => {
        await createAnEvent.expect(201).expect({});
        // Supprimer ? je ne sais pas pourquoi sans dela ne fonctionne pas :(
        const findAll = await request(app.getHttpServer()).get('/events');
        await (app.get(getConnectionToken()) as Connection).db
          .collection('events')
          .findOne({ name: ObjectCreatedEvents[nameEvent.replace('"', '').replace('"', '').trim()].name })
          .then(({ description, endDate, name, startDate, status }) => {
            expect(ObjectCreatedEvents[name]).toEqual({
              description,
              endDate,
              name,
              startDate,
              status,
            });
          });
      });
    });
    test("la création d'un évènement avec erreur", ({ given, when, then }) => {
      let name;
      given('je suis un utilisateur', () => {});

      when('je décide de créer un évènement:', table => {
        const event = table.map(event => {
          return {
            ...event,
            name: event.name.replace('"', '').replace('"', ''),
            description: event.description.replace('"', '').replace('"', ''),
          };
        })[0];
        name = event.name;
        createAnEvent = request(app.getHttpServer()).post('/events').send(event);
      });
      then(/^l'évènement n'a pas été ajouté pour les raisons (.*)$/, async erreurs => {
        const response = await createAnEvent.expect(400);
        expect(JSON.parse(erreurs)).toStrictEqual(JSON.parse(response.text));

        const db = (app.get(getConnectionToken()) as Connection).db;
        await db
          .collection('events')
          .findOne({ name: name.replace('"', '').replace('"', '').trim() })
          .then(event => {
            expect(event).toBeNull();
          });
      });
    });
  });

  defineFeature(featureAffichage, test => {
    const events: Event[] = [
      {
        name: 'Meet-Up Green-It',
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

    test('la requête renvoie tous les évènements', ({ given, when, then }) => {
      let findAll;

      given('je suis un utilisateur', async () => {
        const db = (app.get(getConnectionToken()) as Connection).db;
        await db.collection('events').insertOne(events[0]);
        await db.collection('events').insertOne(events[1]);
        await app.init();
      });

      when('je décide de voir tous les évènements', async () => {
        findAll = request(app.getHttpServer()).get('/events');
      });

      then('les évènements sont affichés:', async events => {
        const response = await findAll.expect(200);
        expect(events).toEqual(
          JSON.parse(response.text).map(event => ({
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            name: event.name,
            status: event.status,
          })),
        );
        JSON.parse(response.text).forEach(event => {
          expect(event).toHaveProperty('_id');
        });
      });
    });
  });
});
