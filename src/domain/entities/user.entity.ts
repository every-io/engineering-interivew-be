import { PermissionRoles } from "../../application/config/roles.config";

export interface User {
    id: number;
    name: string;
    password: string;
    roles: PermissionRoles;
  }
  