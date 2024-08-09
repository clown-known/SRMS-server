import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class AuthService{
    constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  async validateUser(token: string): Promise<any> {
    return this.client.send({ cmd: 'validate-user' }, token).toPromise();
  }
}