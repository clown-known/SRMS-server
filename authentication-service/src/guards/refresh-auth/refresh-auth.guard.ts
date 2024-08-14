import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {}