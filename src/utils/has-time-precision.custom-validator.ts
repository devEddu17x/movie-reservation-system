import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function HasTimePrecision(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'hasTimePrecision',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!(value instanceof Date)) return false;
          return (
            value.getHours() !== undefined && value.getMinutes() !== undefined
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must include hours and minutes`;
        },
      },
    });
  };
}
