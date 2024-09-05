import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
    
@ValidatorConstraint({ async: false })
export class IsPropertyOfConstraint implements ValidatorConstraintInterface {
    validate(propertyName: string, args: ValidationArguments): boolean {
        const targetType = args.constraints[0];
        return propertyName in targetType.prototype;
    }

    defaultMessage(args: ValidationArguments): string {
        const targetType = args.constraints[0];
        return `${args.property} must be a valid property of ${targetType.name}`;
    }
}

export function IsPropertyOf<T>(
    targetType: new (...args: any[]) => T,
    validationOptions?: ValidationOptions
    ) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [targetType],
            validator: IsPropertyOfConstraint,
        });
    };
}