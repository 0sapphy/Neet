declare module "bun" {
    interface Env {
        TOKEN: string;
        DATABASE: string;
        CLIENT_ID: string;
    }
}