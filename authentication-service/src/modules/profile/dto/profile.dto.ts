import { Expose, Transform } from "class-transformer";

export class ProfileDTO {
    @Expose()
    id: string;

    accountId?: string;

    @Expose()
    firstName: string;

    @Expose()
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