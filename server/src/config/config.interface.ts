export default interface ConfigProps {
  port: number;
  globalApiPrefix: string;
  database: {
    sqlite?: string;
  };
  frontendUrl?: string;
  links: {
    mainSchedulePage?: string;
    schedulePage?: string;
    loginCabinetPage?: string;
    scheduleCabinetPage?: string;
  };
}
