declare module NodeJS {
  interface ProcessEnv {
    DATABASE: string;
    TOKEN: string;
    CLIENT_ID: string;
  }
}
