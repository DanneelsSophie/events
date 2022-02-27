import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { parseISO } from 'date-fns';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private trim(values) {
    Object.keys(values).forEach(key => {
      if (typeof values[key] === 'string') {
        values[key] = values[key].trim();
      }
    });
    return values;
  }
  private checkDate(values) {
    if (typeof values['startDate'] === 'string') {
      values['startDate'] = parseISO(values['startDate']);
    }
    if (typeof values['endDate'] === 'string') {
      values['endDate'] = parseISO(values['endDate']);
    }
    return values;
  }
  async transform(values: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return values;
    }
    let transformedValues = this.trim(values);
    transformedValues = this.checkDate(transformedValues);

    const object = plainToClass(metatype, transformedValues);
    const errors = await validate(object);
    if (errors.length > 0) {
      const errorsConstraints = errors.map(error => ({
        [error.property]: error.constraints,
      }));

      throw new BadRequestException({ errors: errorsConstraints });
    }
    return this.trim(transformedValues);
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
