import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './pipes/validation.pipe';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), EventsModule, MongooseModule.forRoot(process.env.MONGO_CONNECTION_URI)],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
