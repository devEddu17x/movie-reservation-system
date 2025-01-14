import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsFutureDate(
  hoursFromNow: number = 0,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const now = new Date();
          const minDate = new Date(
            now.getTime() + hoursFromNow * 60 * 60 * 1000,
          );
          return value instanceof Date && value > minDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be at least ${hoursFromNow} hours in the future`;
        },
      },
    });
  };
}
