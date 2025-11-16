export interface CreateUserCommand {
  email: string;
  password: string;
  roleId: number;
  name: string;
  lastname: string;
  businessTaxId: string;
  legalName: string;
  countryId: number;
  phoneCode?: string;
  phone?: string;
  address?: string;
  createdBy?: number;
}
