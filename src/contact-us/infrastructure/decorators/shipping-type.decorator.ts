import { Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsShippingTypeValidConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const obj = args.object as any;
    const isMaritime = obj.transportType === 'Transporte marítimo';

    if (isMaritime) {
      return typeof value === 'string' && value.trim().length > 0;
    } else {
      return value === undefined || value === null;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const obj = args.object as any;
    if (obj.transportType === 'Transporte marítimo') {
      return `'shippingType' is required when transportType is Transporte marítimo`;
    } else {
      return `'shippingType' must not be provided when transportType is not Transporte marítimo`;
    }
  }
}

export function IsShippingTypeValid() {
  return Validate(IsShippingTypeValidConstraint);
}
