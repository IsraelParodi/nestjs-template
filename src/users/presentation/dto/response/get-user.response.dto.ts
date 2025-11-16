import { User } from '@users/domain/entities/user';

type RoleResponse = {
  id: number;
  name: string;
};

type CountryResponse = {
  id: number;
  name: string;
  currency?: string;
  emoji?: string;
  phoneCode?: string;
};

export class UserResponseDto {
  id: number;
  email: string;
  role: RoleResponse;
  name: string;
  lastname: string;
  businessTaxId: string;
  legalName: string;
  country?: CountryResponse;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email.getValue();

    this.role = {
      id: user.role.id,
      name: user.role.name,
    };

    this.name = user.name;
    this.lastname = user.lastname;
    this.businessTaxId = user.businessTaxId;
    this.legalName = user.legalName;

    this.country = user.country
      ? {
          id: user.country.id,
          name: user.country.name,
          currency: user.country.currency,
          emoji: user.country.emoji,
          phoneCode: user.country.phoneCode,
        }
      : undefined;

    this.phone = user.phone ?? undefined;
    this.createdAt = user.createdAt ? user.createdAt.toISOString() : undefined;
    this.updatedAt = user.updatedAt ? user.updatedAt.toISOString() : undefined;
  }
}
