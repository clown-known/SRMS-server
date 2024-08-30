import { plainToInstance, ClassConstructor } from 'class-transformer';

export function transformToDTO<T, V>(cls: ClassConstructor<T>, plain: V[]): T[];
export function transformToDTO<T, V>(cls: ClassConstructor<T>, plain: V): T;

export function transformToDTO<T, V>(cls: ClassConstructor<T>, plain: V | V[] ): T | T[] {
    if(!plain) return null;
    return plainToInstance(cls, plain, { excludeExtraneousValues: true });
}