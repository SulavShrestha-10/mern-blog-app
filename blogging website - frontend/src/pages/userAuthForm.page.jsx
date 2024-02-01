import React from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
const UserAuthForm = ({ type }) => {
	return (
		<AnimationWrapper keyValue={type}>
			<section className="h-cover flex items-center justify-center">
				<form className="w-[80%] max-w-[400px]">
					<h1 className="text-4xl font-gelasio capitalize text-center mb-24">
						{type === "sign-in" ? "Welcome back" : "Join us today"}
					</h1>
					{type !== "sign-in" && (
						<InputBox type="text" name="fullName" placeholder="Enter your full name" icon="fi-rr-user" />
					)}
					<InputBox type="email" name="email" placeholder="Enter your email" icon="fi-rr-envelope" />
					<InputBox type="password" name="password" placeholder="Enter your password" icon="fi-rr-key" />
					<button type="submit" className="btn-dark center mt-14">
						{type.replace("-", " ")}
					</button>
					<div className="relatve w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
						<hr className="w-1/2 border-black" />
						<p>or</p>
						<hr className="w-1/2 border-black" />
					</div>
					<button className="btn-dark flex items-center gap-4 justify-center w-[90%] center">
						<img src={googleIcon} alt="Google Logo" className="w-5 " />
						continue with google
					</button>
					{type === "sign-in" ? (
						<p className="mt-6 text-dark-grey text-xl text-center">
							Don't have an account?{" "}
							<Link to="/signup" className="underline text-black text-xl ml-1">
								Join us today
							</Link>
						</p>
					) : (
						<p className="mt-6 text-dark-grey text-xl text-center">
							Already have an account?{" "}
							<Link to="/signin" className="underline text-black text-xl ml-1">
								Sign in here
							</Link>
						</p>
					)}
				</form>
			</section>
		</AnimationWrapper>
	);
};

export default UserAuthForm;
