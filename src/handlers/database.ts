import mongoose from "mongoose";
import { Bot, Debug } from "lib:logger";

export default async function () {
	const MongooseURI = Deno.env.get("DATABASE");
	if (MongooseURI === undefined) {
		Bot
			.error(".env file is missing DATABASE key");
		return;
	}

	Debug.Process("Connecting to MongoDB.");
	await mongoose.connect(MongooseURI).then(() =>
		Debug.success("Connected to MongoDB")
	);
}
