import { ValidationArguments } from 'class-validator';
import { IsNotBlankConstraint } from './is-not-blank';

describe('Test the @IsNotBlank', () => {
  const isNotBlankConstraint = new IsNotBlankConstraint();

  describe('validate', () => {
    it('should return true when the string contains only spaces', async () => {
      expect(isNotBlankConstraint.validate('     ')).toBeFalsy();
    });

    it("should return false when the string doesn't contain only spaces", async () => {
      expect(isNotBlankConstraint.validate('aaa bbbb')).toBeTruthy();
      expect(isNotBlankConstraint.validate('  aaa bbbb  ')).toBeTruthy();
    });
  });

  describe('defaultMessage', () => {
    it('should return defaultMessage when defaultMessage is called', async () => {
      const args: ValidationArguments = {
        constraints: [],
        value: 'test',
        targetName: 'isNotBlank',
        property: 'name',
        object: {},
      };

      expect(isNotBlankConstraint.defaultMessage(args)).toStrictEqual('"name" doesn\'t contain only spaces');
    });
  });
});
