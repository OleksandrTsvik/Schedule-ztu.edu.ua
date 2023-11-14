import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  // tslint:disable-next-line:no-any
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  // tslint:disable-next-line:no-any
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    // tslint:disable-next-line:no-any
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }
}
