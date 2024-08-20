import { SetMetadata } from '@nestjs/common';
import { Actions } from '../common/enum';
import { Modules } from '../common/enum';

export const PERMISSIONS_KEY = 'permissions';
export class PermissionsDecorator {
    module: Modules;
    action: Actions;
}
export const Permissions = (permissions: PermissionsDecorator[]) => 
    SetMetadata(PERMISSIONS_KEY, permissions);