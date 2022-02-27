import { IsBeforeConstraint } from './is-before';
import { ValidationArguments } from 'class-validator';

describe('Test the @BeforeContrainst', () => {
  const beforeContrainst = new IsBeforeConstraint();

  describe('validate', () => {
    it('should return true when validation called with startDate < endDate', async () => {
      const args: ValidationArguments = {
        constraints: ['endDate'],
        value: 'test',
        targetName: 'isBefore',
        property: 'isBefore',
        object: { endDate: '2020-04-13T00:00:00.000+08:00' },
      };

      expect(beforeContrainst.validate('2020-04-12T00:00:00.000+08:00', args)).toBeTruthy();
    });

    it('should return false when validation called with startDate < endDate', async () => {
      const args: ValidationArguments = {
        constraints: ['endDate'],
        value: 'test',
        targetName: 'isBefore',
        property: 'isBefore',
        object: { endDate: '2020-04-01T00:00:00.000+08:00' },
      };

      expect(beforeContrainst.validate('2020-04-12T00:00:00.000+08:00', args)).toBeFalsy();
    });
  });

  describe('defaultMessage', () => {
    it('should return defaultMessage when defaultMessage is called', async () => {
      const args: ValidationArguments = {
        constraints: ['endDate'],
        value: 'test',
        targetName: 'isBefore',
        property: 'isBefore',
        object: { endDate: '2020-04-13T00:00:00.000+08:00' },
      };

      expect(beforeContrainst.defaultMessage(args)).toBe(`"isBefore" must be before "endDate"`);
    });
  });
});
