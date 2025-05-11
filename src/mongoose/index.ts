import { Mongoose } from "mongoose";
import { createLogger } from "../../lib";

export default {
    logger: createLogger(["mongodb"]),
    async connect() {
        const mongoose = new Mongoose();

        this.logger.mongodb.info("Attempting to connect to mongodb...");

        mongoose.connect(process.env.DATABASE, { 
            dbName: process.env.NODE_ENV === "production" ? "Production" : "Development"
        });

        this.logger.mongodb.info("Connected to mongodb.");
    }
}