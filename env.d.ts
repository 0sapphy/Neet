declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE: string;
    TOKEN: string;
    CLIENT_ID: string;
    GUILD_ID: string;
    ENV: string;
  }
}
