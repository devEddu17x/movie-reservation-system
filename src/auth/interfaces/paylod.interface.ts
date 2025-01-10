export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  exp?: number;
  iat?: number;
}
