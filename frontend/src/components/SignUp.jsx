import React, { useState } from "react";
import { signupStyles } from "../assets/dummyStyles";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SignUp = ({ API_URL = "http://localhost:4000", onSignup }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	// fetch profile
	const fetchProfile = async (token) => {
		if (!token) return;

		const res = await axios.get(`${API_URL}/api/user/me`, {
			header: { Authorization: `Bearer ${token}` },
		});
		return res.data;
	};

	const persistAuth = (profile, token) => {
		const storage = rememberMe ? localStorage : sessionStorage;
		try {
			if (token) storage.setItem("token", token);
			if (profile) storage.setItem("user", JSON.stringify(profile));
		} catch (error) {
			console.error("Storage Error: ", error);
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!name.trim()) {
			newErrors.name = "Name is required";
		}
		if (!email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = "Email is invalid";
		}
		if (!password) {
			newErrors.password = "Password is required";
		} else if (password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// to signup
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const res = await axios.post(
				`${API_URL}/api/user.register`,
				{ name, email, password },
				{ headers: { "Content-Type": "application/json" } },
			);
			const data = res.data || {};
			const token = data.token ?? null;
			let profile = data.user ?? null;
			if (!profile) {
				// check for any extra fields returned that could be user info
				const copy = { ...data };
				delete copy.token;
				delete copy.user;
				if (Object.keys(copy).length) profile = copy;
			}

			if (!profile && token) {
				try {
					profile = await fetchProfile(token);
				} catch (fetchErr) {
					console.warn("Could not fetch profile after signup token:", fetchErr);
					profile = null;
				}
			}

			if (!profile) profile = { name, email };
			persistAuth(profile, token);
			if (typeof onSignup === "function") {
				try {
					onSignup(profile, rememberMe, token);
				} catch (callErr) {
					console.warn("onSignup threw:", callErr);
					navigate("/");
				}
			} else {
				navigate("/");
			}
			setPassword("");
		} catch (err) {
			console.error("Signup error:", err?.response || err);
			if (err.response?.data?.errors) {
				setErrors(err.response.data.errors);
			} else if (err.response?.data?.message) {
				setErrors({ api: err.response.data.message });
			} else {
				setErrors({ api: err.message || "An unexpected error occurred" });
			}
		} finally {
            setIsLoading(false)
        }
	};

	return (
        <div className={signupStyles.pageContainer}>
            <div className={signupStyles.cardContainer}>
                <div className={signupStyles.header}>
                    <button onClick={()=> navigate(-1)} className={signupStyles.backButton}>
                        <ArrowLeft className="w-5 h5" />
                        Back
                    </button>
                </div>
            </div>
        </div>
    )
};

export default SignUp;
