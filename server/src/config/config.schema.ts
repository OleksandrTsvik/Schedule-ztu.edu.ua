import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(5001),
  GLOBAL_API_PREFIX: Joi.string().default('api'),

  SQLITE_DATABASE: Joi.string().required(),

  FRONTEND_URL: Joi.string().required(),

  ENCRYPTION_ALGORITHM: Joi.string().default('aes-256-cbc'),
  ENCRYPTION_KEY: Joi.string().required(),
  ENCRYPTION_IV: Joi.string().required(),

  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),

  LINK_TO_MAIN_SCHEDULE_PAGE: Joi.string().required(),
  LINK_TO_SCHEDULE_PAGE: Joi.string().required(),
  LINK_TO_LOGIN_CABINET_PAGE: Joi.string().required(),
  LINK_TO_SCHEDULE_CABINET_PAGE: Joi.string().required(),
});
