import React, { memo, useCallback, useEffect, useState } from "react";
import { profileStyles } from "../assets/dummyStyles";
import Modal from "react-modal";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:4000/api";

Modal.setAppElement("#root");
// Move PasswordInput component outside of ProfilePage to prevent recreation on every render
const PasswordInput = memo(
	({ name, label, value, error, showField, onToggle, onChange, disabled }) => (
		<div>
			<label className={profileStyles.passwordLabel}>{label}</label>
			<div className={profileStyles.passwordContainer}>
				<input
					type={showField ? "text" : "password"}
					name={name}
					value={value}
					onChange={onChange}
					className={`${profileStyles.inputWithError} ${
						error ? "border-red-300" : "border-gray-200"
					}`}
					placeholder={`Enter ${label.toLowerCase()}`}
					disabled={disabled}
					// Add key prop to help React identify the input
					key={`password-input-${name}`}
				/>
				<button
					type='button'
					onClick={onToggle}
					className={profileStyles.passwordToggle}
					disabled={disabled}>
					{showField ?
						<EyeOff className='w-5 h-5' />
					:	<Eye className='w-5 h-5' />}
				</button>
			</div>
			{error && <p className={profileStyles.errorText}>{error}</p>}
		</div>
	),
);

PasswordInput.displayName = "PasswordInput";

const Profile = ({ user: onUpdateProfile, onLogout }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState({
		name: "",
		email: "",
		joinDate: "",
	});
	const [editMode, setEditMode] = useState(false);
	const [tempUser, setTempUser] = useState({ ...user });
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [passwordData, setPasswordData] = useState({
		current: "",
		new: "",
		confirm: "", // same as the new password
	});
	const [showPassword, setShowPassword] = useState({
		current: false,
		new: false,
		confirm: false,
	});
	const [passwordErrors, setPasswordErrors] = useState({});
	const [loading, setLoading] = useState(false);

    const getAuthToken = useCallback(()=> localStorage.getItem('token'), [])

    // API request
    const handleAPIrequest = useCallback(async (method, endpoint, data=null) => {
        const token = getAuthToken();
        if(!token) {
            navigate('login');
            return null;
        }

        try {
            setLoading(true);
            const config = {
                method,
                url: `${BASE_URL}${endpoint}`,
                headers: {Authorization: `Bearer ${token}`},
            }
            if(data) config.data = data;
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.log(`${method} request error: `, error)
            if(error.response?.status === 401) {
                navigate('/login')
            }
            throw error;
        } finally {
            setLoading(false)
        }
    }, [getAuthToken, navigate])

    // to fetch current user
    useEffect(()=> {
        const fetchUserData = async () => {
            try {
                const data = await handleAPIrequest('get', '/user/me');
                if(data) {
                    const userData = data.user || data;
                    setUser(userData);
                    setTempUser(userData)
                }
            } catch (error) {
                toast.errror("Failed to load user data")
            }
        }
    }, [])

	return <div>Profile</div>;
};

export default Profile;
