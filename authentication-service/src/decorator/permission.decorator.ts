import { SetMetadata } from '@nestjs/common';
import { Actions } from '../common/enum';
import { Modules } from '../common/enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (module: Modules, action: Actions) => 
    SetMetadata(PERMISSIONS_KEY, `${module}:${action}`);