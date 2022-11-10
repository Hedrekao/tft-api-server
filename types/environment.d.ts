export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      API_KEY: string;
      CMS_API_KEY: string;
    }
  }
}
