declare namespace NodeJS {
	interface ProcessEnv {
		TOKEN: string;
		DATABASE: string;
		CLIENT_ID: string;
		NODE_ENV: "production" | "development";
		DEV_CLIENT_ID: string;
	}
}
