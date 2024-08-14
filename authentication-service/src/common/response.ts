export class Response<T> {
    status: number;
    message: string;
    errors: { [key: string]: any } | null;
    data: T;
}