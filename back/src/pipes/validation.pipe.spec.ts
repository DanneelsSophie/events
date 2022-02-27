import { ArgumentMetadata } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';
import { IsString, MaxLength, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

describe('Test the @ValidationPipe', () => {
  const pipe = new ValidationPipe();

  class TestModel {
    @IsString({ message: "ce n'est pas un int" })
    @MaxLength(4, { message: 'Il ne doit pas dépasser 4 caractères' })
    public prop1: string;

    @MaxLength(2, { message: 'Il ne doit pas dépasser 2 caractères' })
    public prop2: string;
  }

  class TestModelDate {
    @Type(() => Date)
    @IsDate()
    public startDate: string;
    @Type(() => Date)
    @IsDate()
    public endDate: string;
  }
  it('should return the same value when metatype is undefined', async () => {
    // given
    const given = { prop1: 'eve', prop2: 'a' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      data: '',
    };
    await expect(pipe.transform(given, metadata)).resolves.toEqual(given);
  });

  it("should return the same value { prop1: 'eve' } of the parameter because it's a valid one", async () => {
    // given
    const given = { prop1: 'eve', prop2: 'a' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestModel,
      data: '',
    };
    await expect(pipe.transform(given, metadata)).resolves.toEqual(given);
  });
  it("should return the same value { startDate: '2019-02-31T00:00:00.000+01:00' ,endDate: '2050-04-33T00:00:00.000+01:00'} of the parameter because it's there are two date are valids", async () => {
    // given
    const given = { startDate: '2019-02-01T00:00:00.000+01:00', endDate: '2019-02-04T00:00:00.000+01:00' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestModelDate,
      data: '',
    };
    await expect(pipe.transform(given, metadata)).resolves.toEqual(given);
  });

  it('should throw BadRequestException when there is two errors', async () => {
    // given
    const given = { prop1: '1', prop2: 'a' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestModel,
      data: '',
    };
    try {
      // when
      await pipe.transform(given, metadata);
    } catch ({ message, response }) {
      // then
      expect(message).toBe('Bad Request Exception');
      expect(response).toStrictEqual({
        errors: [
          {
            prop1: {
              maxLength: 'Il ne doit pas dépasser 4 caractères',
            },
          },
        ],
      });
    }
  });

  it("should throw BadRequestException with params { startDate: '2019-02-31T00:00:00.000+01:00' ,endDate: '2050-04-33T00:00:00.000+01:00'} when validate is called because it's there are two date are invalids", async () => {
    // given
    const given = { startDate: '2019-02-31T00:00:00.000+01:00', endDate: '2050-04-33T00:00:00.000+01:00' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestModelDate,
      data: '',
    };
    try {
      // when
      await pipe.transform(given, metadata);
    } catch ({ message, response }) {
      // then
      expect(message).toBe('Bad Request Exception');
      expect(response).toStrictEqual({
        errors: [
          {
            startDate: {
              isDate: 'startDate must be a Date instance',
            },
          },
          {
            endDate: {
              isDate: 'endDate must be a Date instance',
            },
          },
        ],
      });
    }
  });

  it('should throw BadRequestException when there are two errors in the same object', async () => {
    // given
    const given = { prop1: 1, prop2: 'a' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestModel,
      data: '',
    };
    try {
      // when
      await pipe.transform(given, metadata);
    } catch ({ message, response }) {
      // then
      expect(message).toBe('Bad Request Exception');
      expect(response).toStrictEqual({
        errors: [
          {
            prop1: {
              isString: "ce n'est pas un int",
              maxLength: 'Il ne doit pas dépasser 4 caractères',
            },
          },
        ],
      });
    }
  });

  it('should throw BadRequestException when there are three errors in two object', async () => {
    // given
    const given = { prop1: 1, prop2: 'abc' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestModel,
      data: '',
    };
    try {
      // when
      await pipe.transform(given, metadata);
    } catch ({ message, response }) {
      // then
      expect(message).toBe('Bad Request Exception');
      expect(response).toStrictEqual({
        errors: [
          {
            prop1: {
              isString: "ce n'est pas un int",
              maxLength: 'Il ne doit pas dépasser 4 caractères',
            },
          },
          {
            prop2: {
              maxLength: 'Il ne doit pas dépasser 2 caractères',
            },
          },
        ],
      });
    }
  });
});
