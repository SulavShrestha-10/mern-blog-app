import React, { useState } from "react";

const InputBox = ({ name, type, value, placeholder, icon }) => {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<div className="relative w-[100%] mb-4">
			<input
				name={name}
				type={type === "password" ? (showPassword ? "text" : "password") : type}
				placeholder={placeholder}
				defaultValue={value}
				id={name}
				className="input-box"
			/>
			<i className={`fi ${icon} input-icon`}></i>
			{type === "password" && (
				<i
					onClick={() => setShowPassword(!showPassword)}
					className={`fi fi-rr-eye${
						!showPassword ? "-crossed" : ""
					} input-icon left-[auto] right-4 cursor-pointer`}></i>
			)}
		</div>
	);
};

export default InputBox;
