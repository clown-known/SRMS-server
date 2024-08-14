import { Response } from "src/common/response";
import { IProfile } from "../profile.inteface";

export class ProfileResponse extends Response<IProfile[]> {
}