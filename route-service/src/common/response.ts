export interface Response<T> {
    statusCode: number;
    message: string;
    errors: { [key: string]: any } | null;
    data: T;
}