export enum Modules {
  ACCOUNT = 'account',
  ROLE = 'role',
  ROUTE = 'route'
}
export enum Actions {
  CREATE = 'create',
  UPDATE = 'update',
  UPDATE_RELATED = 'update_related',
  DELETE = 'delete',
  DELETE_RELATED = 'delete_related',
  GET = 'get',
  GET_ALL = 'get_all',
  GET_RELATED = 'get_related',
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
