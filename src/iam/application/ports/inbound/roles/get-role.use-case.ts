import { Role } from '@users/domain/entities/role';

export abstract class GetRoleUseCase {
  abstract execute(id: number): Promise<Role>;
}
