export interface SignUpCommand {
  email: string;
  password: string;
  name: string;
  lastname: string;
  businessTaxId: string;
  legalName: string;
  country?: number;
}
