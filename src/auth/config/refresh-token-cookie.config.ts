import { CookieOptions, Request } from 'express';

const cookieName = 'refreshToken';
const options: CookieOptions = {
  path: '/auth/refresh-tokens',
  httpOnly: true,
  sameSite: 'strict',
  secure: true,
  maxAge: 1000 * 60 * 60 * 24, // one day as in the refresh token expiration
};

export const refreshTokenCookie = {
  name: cookieName,
  options,
};

export const extractRefreshTokenFromCookie = (req: Request): string | null => {
  const cookies = req.headers.cookie?.split('; ');
  if (!cookies?.length) {
    return null;
  }
  const refreshTokenCookie = cookies.find((cookie) =>
    cookie.startsWith(`${cookieName}=`),
  );

  if (!refreshTokenCookie) {
    return null;
  }

  const cookie = refreshTokenCookie.split('=')[1];

  (req as any).refreshTokenCookie = cookie;
  return cookie;
};
