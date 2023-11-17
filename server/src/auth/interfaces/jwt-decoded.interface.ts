import { JwtPayload } from './jwt-payload.interface';

export interface JwtDecoded extends JwtPayload {
  iat: number;
  exp: number;
}
