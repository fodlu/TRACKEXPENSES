import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		mongoose.connection.on("connected", () => {
			console.log("MongoDB connected successfully");
		});
		await mongoose.connect(process.env.MONGODB_URI);
	} catch (error) {
		console.error("Error connecting to MongoDB:", error.message);
	}
};
// export const connectDB = async () => {
// 	await mongoose
// 		.connect('mongodb://localhost:27017/trackExpense')
// 		.then(() => console.log("DB CONNECTED"));
// };
