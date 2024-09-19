import { ITokenResponse } from "../token.interface";

export class LoginResponse{
    name: string;
    avatar?: string;
    token: ITokenResponse;
}