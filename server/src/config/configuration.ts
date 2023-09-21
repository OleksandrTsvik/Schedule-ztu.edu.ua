import ConfigProps from './config.interface';

export default (): ConfigProps => ({
  port: parseInt(process.env.PORT, 10),
  globalApiPrefix: process.env.GLOBAL_API_PREFIX,
  database: {
    sqlite: process.env.SQLITE_DATABASE,
  },
  frontendUrl: process.env.FRONTEND_URL,
  links: {
    mainSchedulePage: process.env.LINK_TO_MAIN_SCHEDULE_PAGE,
    schedulePage: process.env.LINK_TO_SCHEDULE_PAGE,
    loginCabinetPage: process.env.LINK_TO_LOGIN_CABINET_PAGE,
    scheduleCabinetPage: process.env.LINK_TO_SCHEDULE_CABINET_PAGE,
  },
});
