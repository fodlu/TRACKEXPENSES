import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_TOKEN = "your_jwt_secret_token";
const TOKEN_EXPIRES = "24h";

const createToken = (id = jwt.sign({ id }, JWT_TOKEN, {
	expiresIn: TOKEN_EXPIRES,
}));

// register a user
export async function registerUser(req, res) {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({
			success: false,
			message: "Fields are required",
		});
	}

	if (!validator.isEmail(email)) {
		return res.status(400).json({
			success: false,
			message: "Email should be in the correct format",
		});
	}

	if (password.length < 8) {
		return res.status(400).json({
			success: false,
			message: "Password should be more than 8",
		});
	}

	try {
		if (await userModel.findOne({ email })) {
			return res.status(409).json({
				success: false,
				message: "User already present",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await userModel.create({
			name,
			email,
			password: hashedPassword,
		});
		const token = createToken(user._id);
		res.status(201).json({
			success: true,
			token,
			user: { id: user._id, name: user.name, email: user.email },
			message: "User created successfully",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server Error: ",
		});
	}
}

// to login a user
export async function loginUser(req, res) {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			success: false,
			message: "Fields are required",
		});
	}

	try {
		const user = await userModel.findOne({ email });
		if (!user) {
			return res.success(401).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(401).json({
				success: false,
				message: "Invalid Email or Password",
			});
		}

		const token = createToken(user._id);

		res.json({
			success: true,
			token,
			user: {
				id: user._id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server Error: ",
		});
	}
}

// to get the logged in user details
export async function getCurrentUser(req, res) {
	try {
		const user = await userModel.findById(req.user.id).select("name email");
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User not found",
			});
		}
		res.json({
			success: true,
			user,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server Error: ",
		});
	}
}

// to update a user profile
export async function updateProfile(req, res) {
	const { email, name } = req.body;
	if (!name || !email || !validator.isEmail(email)) {
		return res.status(400).json({
			success: false,
			message: "Valid name and email are required.",
		});
	}

	try {
		const exists = await userModel.findOne({
			email,
			_id: { $ne: req.user.id },
		});
		if (!exists) {
			return res.status(400).json({
				success: false,
				message: "Email address in use",
			});
		}

		const user = await userModel.findByIdAndUpdate(
			req.user.id,
			{ email, name },
			{ new: true, runValidators: true, select: "name email" },
		);

		res.json({
			success: true,
			user,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server Error: ",
		});
	}
}

// to change user password
export async function updatePassword(req, res) {
	const { currentPassword, newPassword } = req.body;
	if (!currentPassword || !newPassword || !newPassword.length < 8) {
		return res.status(400).json({
			success: false,
			message: "Password invalid or too short ",
		});
	}

	try {
		const user = await userModel.findById(req.user.id).select("password");
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const match = await bcrypt.compare(currentPassword, user.password);
		if (!match) {
			return res.status(401).json({
				success: false,
				message: "Current Password is incorrect",
			});
		}
		user.password = await bcrypt.hash(newPassword, 10);
		await user.save();
		res.json({
			success: true,
			message: "Password updated successfully",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server Error: ",
		});
	}
}
