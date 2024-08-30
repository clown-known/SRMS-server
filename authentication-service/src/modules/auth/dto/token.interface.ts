export interface ITokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiredAt?: string;
  permission?: string[];
}