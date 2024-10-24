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
        // console.log('action : '); 
        return RolePermissions;
    }
    async beforeRemove(event: RemoveEvent<RolePermissions>): Promise<void> {
        console.log('Permission removed:'+ event.entityId);
        console.log('Permission databaseEntity:'+ event.databaseEntity);
        console.log('Permission queryRunner:'+ event.queryRunner.data);
        console.log('Permission connection:'+ event.connection);
        console.log('Permission metadata:'+ event.metadata);
    }
    
    async beforeInsertInsert(event: InsertEvent<RolePermissions>) {
        console.log('Permission insert:'+ event.entity)
    }
}