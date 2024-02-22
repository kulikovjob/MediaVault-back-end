import { ApplicationPhaces } from './src/types/types';

declare module 'ambient' {
  declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE_PASSWORD: string;
        DATABASE_PORT: string;
        DATABASE_HOST: string;
        DATABASE_USERNAME: string;
        DATABASE_NAME: string;
        NODE_ENV: ApplicationPhaces;
        PORT?: string;
      }
    }
  }
}
