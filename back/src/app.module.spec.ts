import { Test } from '@nestjs/testing';

import { EventsModule } from './events/events.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './pipes/validation.pipe';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

describe('AppModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), EventsModule, MongooseModule.forRoot(process.env.MONGO_CONNECTION_URI)],
      controllers: [],
      providers: [
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        },
      ],
    }).compile();

    expect(module).toBeDefined();
  });
});
