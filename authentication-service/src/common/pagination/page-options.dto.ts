import { ClassConstructor, Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Order } from "../enum";
import { IsPropertyOf } from "src/decorator/is-property-of.decorator";
import { Account } from "src/entity";

export class PageOptionsDto {

    @IsEnum(Order)
    @IsOptional()
    readonly order?: Order = Order.ASC;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    readonly take?: number = 20;

    @IsString()
    readonly searchKey?:string = '';

    @IsString()
    // @IsPropertyOf(Account, { message: 'orderBy must be a valid property of the target class' })
    @IsOptional()
    readonly orderBy?:string = '';

    get skip(): number {
        return (this.page - 1) * this.take;
    }
}