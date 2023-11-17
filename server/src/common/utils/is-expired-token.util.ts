/**
 * Checks if the JWT token has expired by the specified offset in seconds.
 * @param expirationTime Token expiration time in seconds.
 * @param offsetSeconds The number of seconds to indicate the offset in the token expiration check. Default 0.
 * @returns Returns `true` if the token has already expired or will expire within the specified offset in seconds, `false` otherwise.
 */
export default function isExpiredToken(
  expirationTime: number,
  offsetSeconds: number = 0,
): boolean {
  const currentTime = new Date().getTime() / 1000;
  const expirationTimeWithOffset = expirationTime - offsetSeconds;

  return currentTime >= expirationTimeWithOffset;
}
