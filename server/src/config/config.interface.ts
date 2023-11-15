export default interface ConfigProps {
  port: number;
  globalApiPrefix: string;
  database: {
    sqlite?: string;
  };
  frontendUrl?: string;
  accessJwt: {
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
