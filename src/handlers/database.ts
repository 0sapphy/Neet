/** @format */

import mongoose from "mongoose";
import { Bot } from "../lib";

export default async function () {
	const MongooseURI = process.env.DATABASE;
	if (MongooseURI === undefined) {
		Bot.error(".env file is missing DATABASE key");
		return;
	}

	await mongoose.connect(MongooseURI).then(() => Bot.note("Connected to MongoDB"));
}
