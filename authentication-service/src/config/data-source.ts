import { Account } from 'src/entity/account';
import { AuthenticationCode } from 'src/entity/authentication_code';
import { Permission } from 'src/entity/permission';
import { Profile } from 'src/entity/profile';
import { Roles } from 'src/entity/role';
import { RolePermissions } from 'src/entity/role.permissions';
import { RolePermissionSubscriber } from 'src/subcriber/role-permission.subscriber';
import { DataSource, DataSourceOptions } from 'typeorm';
require('dotenv').config();
// use this file for running migration
export const postgresOptions: DataSourceOptions = {
    type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [Account,Roles,Permission,Profile,RolePermissions,AuthenticationCode],
      synchronize: true,
      subscribers:[RolePermissionSubscriber]
    
};
// console.log(postgresOptions)
const dataSource = new DataSource(postgresOptions);
export default dataSource;