import { Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsDocumentNumberValidConstraint implements ValidatorConstraintInterface {
  validate(documentNumber: string, args: ValidationArguments): boolean {
    const { documentType } = args.object as any;

    const patterns: Record<string, RegExp> = {
      DNI: /^\d{8}$/,
      RUC: /^(?:20|10)\d{9}$/,
      CE: /^\d{20}$/,
    };

    const regex = patterns[documentType];

    if (!regex) {
      return false;
    }

    return regex.test(documentNumber);
  }

  defaultMessage(args: ValidationArguments): string {
    const { documentType } = args.object as any;

    const documentLength: Record<string, number> = {
      DNI: 8,
      RUC: 20,
      CE: 11,
    };

    const documentNumberLength = documentLength[documentType];

    if (!documentNumberLength) {
      return `documentNumber invalid because of documentType invalid`;
    }

    return `documentNumber must contain only numbers and have ${documentNumberLength} digits for the documentType "${documentType}".`;
  }
}

export function IsDocumentNumberValid() {
  return Validate(IsDocumentNumberValidConstraint);
}
