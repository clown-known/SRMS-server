import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { RolePermissions } from 'src/entity';
import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    RemoveEvent,
    SoftRemoveEvent,
} from 'typeorm';
import { AuthService } from '../modules/auth/auth.service';

@EventSubscriber()
export class RolePermissionSubscriber implements EntitySubscriberInterface<RolePermissions> {
    // constructor(@InjectRedis() private readonly redisService: Redis,
    //             private readonly authService: AuthService
    // ) {
    // }

    listenTo() {
        console.log('action : '); 
        return RolePermissions;
    }
    async beforeRemove(event: RemoveEvent<RolePermissions>): Promise<void> {
        console.log('Permission removed:'+ event.entity);
    }
    async beforeInsertInsert(event: InsertEvent<RolePermissions>) {
    }
}