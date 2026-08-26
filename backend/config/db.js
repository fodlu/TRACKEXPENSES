import mongoose from "mongoose";

// export const connectDB = async () => {
// 	await mongoose
// 		.connect(
// 			`mongodb+srv://musediqopeyemi_db_user:NQLvYMZQNFzbaKCl@cluster0.sv7q1tv.mongodb.net/expenses`,
// 		)
// 		.then(() => console.log("DB CONNECTED"));
// };
export const connectDB = async () => {
	await mongoose
		.connect('mongodb://localhost:27017/trackExpense')
		.then(() => console.log("DB CONNECTED"));
};
