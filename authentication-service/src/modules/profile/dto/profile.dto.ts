

import { Expose, Transform } from "class-transformer";

export class ProfileDTO {
    @Expose()
    id: string;

    accountId?: string;

    firstName: string;
    lastName: string;

    @Transform(({obj})=>obj.firstName + ' ' + obj.lastName)
    @Expose()
    fullName: string

    @Expose()
    phoneNumber: string;
    @Expose()
    address: string;
    @Expose()
    dateOfBirth: Date;
}