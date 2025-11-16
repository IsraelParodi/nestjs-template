import { CreateUserProps } from '../props/create-user.props';
import { RestoreUserProps } from '../props/restore-user.props';
import { Email } from '../value-objects/email.vo';
import { Role } from './role';
import { Country } from '@localities/domain/entities/country';

export class User {
  private readonly _id?: number;
  private readonly _email: Email;
  private readonly _passwordHash: string;
  private readonly _role: Role;
  private readonly _name: string;
  private readonly _lastname: string;
  private readonly _businessTaxId: string;
  private readonly _legalName: string;
  private readonly _country: Country;
  private readonly _phone?: string;
  private readonly _address?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;
  private readonly _deletedAt?: Date;

  private constructor(props: CreateUserProps | RestoreUserProps) {
    this._id = 'id' in props ? props.id : undefined;

    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._role = props.role;

    this._name = props.name?.trim();
    this._lastname = props.lastname?.trim();
    this._businessTaxId = props.businessTaxId?.trim();
    this._legalName = props.legalName?.trim();

    this._country = props.country;
    this._phone = props.phone;
    this._address = props.address?.trim();

    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = 'updatedAt' in props ? props.updatedAt : undefined;
    this._deletedAt = 'deletedAt' in props ? props.deletedAt : undefined;
  }

  static create(props: CreateUserProps): User {
    return new User(props);
  }

  static restore(props: RestoreUserProps): User {
    return new User(props);
  }

  get id(): number | undefined {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get role(): Role {
    return this._role;
  }

  get country(): Country {
    return this._country;
  }

  get phone(): string | undefined {
    return this._phone;
  }

  get address(): string | undefined {
    return this._address;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get name(): string {
    return this._name;
  }
  get lastname(): string {
    return this._lastname;
  }
  get businessTaxId(): string {
    return this._businessTaxId;
  }
  get legalName(): string {
    return this._legalName;
  }
}
