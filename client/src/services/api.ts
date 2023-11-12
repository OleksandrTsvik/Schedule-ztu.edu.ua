import { REACT_APP_API_URL } from '../utils/constants/node-env';

export const baseUrl = REACT_APP_API_URL;

export interface ApiError {
  data: {
    error: string;
    message: string | string[];
    statusCode: number;
  };
  status: number;
}
