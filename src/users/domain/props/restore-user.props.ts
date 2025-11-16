import { Role } from '../entities/role';
import { Email } from '../value-objects/email.vo';
import { Country } from '@localities/domain/entities/country';

export interface RestoreUserProps {
  id: number;
  email: Email;
  passwordHash: string;
  role: Role;
  name: string;
  lastname: string;
  businessTaxId: string;
  legalName: string;
  country: Country;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
