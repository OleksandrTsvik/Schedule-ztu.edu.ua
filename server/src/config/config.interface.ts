export default interface ConfigProps {
  port: number;
  globalApiPrefix: string;
  database: {
    sqlite?: string;
  };
  frontendUrl?: string;
  jwtAccess: {
    secret?: string;
    expiresIn?: string;
  };
  jwtRefresh: {
    secret?: string;
    expiresIn?: string;
  };
  links: {
    mainSchedulePage?: string;
    schedulePage?: string;
    loginCabinetPage?: string;
    scheduleCabinetPage?: string;
  };
}
