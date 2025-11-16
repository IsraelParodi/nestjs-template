export interface CreateRoleCommand {
  name: string;
  description: string;
  permissions: number[];
}
