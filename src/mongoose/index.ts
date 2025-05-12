import { Mongoose } from "mongoose";
import { logger } from "../../lib";

export default {
	async connect() {
		const mongoose = new Mongoose();

		logger.debug("Attempting to connect to mongodb...");

		mongoose.connect(process.env.DATABASE, {
			dbName: process.env.NODE_ENV === "production" ? "Production" : "Development"
		});

		logger.ready("Connected to mongodb.");
	}
};
