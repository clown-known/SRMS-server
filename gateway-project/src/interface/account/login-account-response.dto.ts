export class LoginAccountResponseDto {
    message: string;
    data: {
      token: string;
    };
    errors: { [key: string]: any };
  }