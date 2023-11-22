import ConfigProps from './config.interface';

export default (): ConfigProps => ({
  port: parseInt(process.env.PORT || '5001', 10),
  globalApiPrefix: process.env.GLOBAL_API_PREFIX || 'api',
  database: {
    sqlite: process.env.SQLITE_DATABASE,
  },
  frontendUrl: process.env.FRONTEND_URL,
  encryption: {
    algorithm: process.env.ENCRYPTION_ALGORITHM,
    key: process.env.ENCRYPTION_KEY,
    iv: process.env.ENCRYPTION_IV,
  },
  jwtAccess: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  },
  jwtRefresh: {
    secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  },
  links: {
    mainSchedulePage: process.env.LINK_TO_MAIN_SCHEDULE_PAGE,
    schedulePage: process.env.LINK_TO_SCHEDULE_PAGE,
    loginCabinetPage: process.env.LINK_TO_LOGIN_CABINET_PAGE,
    scheduleCabinetPage: process.env.LINK_TO_SCHEDULE_CABINET_PAGE,
  },
});
