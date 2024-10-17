export enum Modules {
  ACCOUNT = 'account',
  ROLE = 'role',
  ROUTE = 'route',
  POINT = 'point'
}
export enum Actions {
  CREATE = 'create',
  UPDATE = 'update',
  UPDATE_RELATED = 'update_related',
  DELETE = 'delete',
  DELETE_RELATED = 'delete_related',
  READ = 'read',
  PASSWORD_RESET = 'reset-password',
  ASSIGN_ROLE = 'assign-role'
}
export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

export enum EmailTemplate {
  WELCOME = 'welcome-template',
  PASSWORD_RESET = 'password-reset-template',
  ACCOUNT_ACTIVATION = 'account-activation-template'
}
