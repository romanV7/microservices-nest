export function getTokenFromAuthHeader(authHeader: string): string {
  return authHeader.split('Bearer ')[1]
}
