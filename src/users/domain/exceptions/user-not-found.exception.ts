import { DomainException } from '@common/domain/exceptions/domain.exception';

export class UserNotFoundException extends DomainException {
  readonly code = 'USER_NOT_FOUND';

  constructor(message = 'User not found') {
    super(message, 404);
  }
}
