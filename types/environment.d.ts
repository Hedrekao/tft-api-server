export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      API_KEY: string;
      CMS_API_KEY: string;
      EMAIL_PASSWORD: string;
      EMAIL: string;
      JWT_SECRET_KEY: string;
      TEST_DATABASE_URL: string;
    }
  }
}
