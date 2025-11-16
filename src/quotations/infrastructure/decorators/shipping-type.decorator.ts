import { Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsShippingTypeValidConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const obj = args.object as any;
    const isMaritime = obj.transportType === 'Transporte marítimo';

    if (!isMaritime) {
      // Si no es marítimo, shippingType no debe existir
      return value === undefined || value === null;
    }

    // Si es marítimo, shippingType es obligatorio y debe ser string válido
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      return false;
    }

    if (value === 'FCL') {
      // containerCode requerido, cargoVolume prohibido
      return (
        typeof obj.containerCode === 'string' &&
        obj.containerCode.trim().length > 0 &&
        (obj.cargoVolume === undefined || obj.cargoVolume === null)
      );
    }

    if (value === 'LCL') {
      // cargoVolume requerido (número), containerCode prohibido
      return (
        typeof obj.cargoVolume === 'number' &&
        !isNaN(obj.cargoVolume) &&
        (obj.containerCode === undefined || obj.containerCode === null)
      );
    }

    return true; // otros casos
  }

  defaultMessage(args: ValidationArguments): string {
    const obj = args.object as any;
    const isMaritime = obj.transportType === 'Transporte marítimo';

    if (!isMaritime) {
      return `'shippingType' must not be provided when transportType is not Transporte marítimo`;
    }

    if (!args.value) {
      return `'shippingType' is required when transportType is Transporte marítimo`;
    }

    if (args.value === 'FCL') {
      if (!obj.containerCode || obj.containerCode.trim() === '') {
        return `'containerCode' is required when shippingType is FCL`;
      }
      if (obj.cargoVolume !== undefined && obj.cargoVolume !== null) {
        return `'cargoVolume' must not be provided when shippingType is FCL`;
      }
    }

    if (args.value === 'LCL') {
      if (typeof obj.cargoVolume !== 'number' || isNaN(obj.cargoVolume)) {
        return `'cargoVolume' (as a number) is required when shippingType is LCL`;
      }
      if (obj.containerCode !== undefined && obj.containerCode !== null) {
        return `'containerCode' must not be provided when shippingType is LCL`;
      }
    }

    return `'shippingType' is invalid or has conflicting fields`;
  }
}

export function IsShippingTypeValid() {
  return Validate(IsShippingTypeValidConstraint);
}
