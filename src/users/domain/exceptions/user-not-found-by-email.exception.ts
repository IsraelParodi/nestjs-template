import { DomainException } from '@common/domain/exceptions/domain.exception';

export class UserNotFoundByEmailException extends DomainException {
  readonly code = 'USER_NOT_FOUND';

  constructor(message = 'User not found by email') {
    super(message, 404);
  }
}
