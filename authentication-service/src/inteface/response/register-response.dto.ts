import { Response } from "src/common/response";

interface RegisterResponse {
    email: string;
    name: string;
    phone: string;
    address: string;
}
export class RegisterResponseDTO  extends Response<RegisterResponse>{

}
