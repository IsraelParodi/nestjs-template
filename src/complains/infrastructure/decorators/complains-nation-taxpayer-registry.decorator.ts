import { Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsNationalTaxpayerRegistryValidConstraint implements ValidatorConstraintInterface {
  validate(nationalTaxpayerRegistry: string): boolean {
    const regex: RegExp = /^(?:20|10)\d{9}$/;

    return regex.test(nationalTaxpayerRegistry);
  }

  defaultMessage(): string {
    return `The National Taxpayer Registry must start with 10 or 20 and have 11 as length`;
  }
}

export function IsNationalTaxpayerRegistryValid() {
  return Validate(IsNationalTaxpayerRegistryValidConstraint);
}
