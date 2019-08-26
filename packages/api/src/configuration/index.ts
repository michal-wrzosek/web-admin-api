import { NODE_ENVS } from 'src/types/NodeEnvs';

export const NODE_ENV: NODE_ENVS = (process.env.NODE_ENV as NODE_ENVS) || NODE_ENVS.DEVELOPMENT;
export const PORT: string = process.env.PORT || '8080';
export const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://waa-mongo:27017/development';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'jwt_secret_string';
export const AUTH_TOKEN_MAX_AGE_IN_SECONDS: number = Number(process.env.AUTH_TOKEN_MAX_AGE_IN_SECONDS) || 60 * 60 * 24; // 1 day by default
export const USER_PASSWORD_MIN_LENGTH: number = Number(process.env.USER_PASSWORD_MIN_LENGTH) || 6;
export const USER_PASSWORD_MAX_LENGTH: number = Number(process.env.USER_PASSWORD_MAX_LENGTH) || 64;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
