import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import grpcOptions from 'src/config/grpc.client';

interface PermissionService {
    GetPermission(data: { userId: string }): Observable<{ data: string[] }>;
}

@Injectable()
export class AuthGrpcService implements OnModuleInit {
    @Client(grpcOptions)
    private client: ClientGrpc;

    private permissionService: PermissionService;

    onModuleInit() {
        this.permissionService = this.client.getService<PermissionService>('PermissionService');
    }

    async getPermissionsOfUser(userId: string) {
        const response = await firstValueFrom(this.permissionService.GetPermission({userId}));
        console.log(response)
        return response; 
    }
}