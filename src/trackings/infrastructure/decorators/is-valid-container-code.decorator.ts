import { CreateContainerDto } from '@trackings/presenters/dto/create-containers.dto';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsValidContainerCode', async: false })
export class IsValidContainerCodeConstraint implements ValidatorConstraintInterface {
  validate(seals: any[], args: ValidationArguments) {
    const trackingDto = args.object as any;

    if (!trackingDto.containers || !Array.isArray(seals)) {
      return false;
    }

    const containerCodes = trackingDto.containers.map((container: CreateContainerDto) => container.code);

    for (const seal of seals) {
      if (!containerCodes.includes(seal.containerCode)) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Each seal must have a valid containerCode that exists in the containers array.';
  }
}
