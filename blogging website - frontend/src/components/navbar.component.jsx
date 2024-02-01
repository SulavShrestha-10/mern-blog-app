import React from "react";
import logo from "../imgs/logo.png";
import { Link } from "react-router-dom";
const Navbar = () => {
	return (
		<nav className="navbar">
			<Link to="/">
				<img src={logo} className="flex-none w-10" alt="logo" />
			</Link>
		</nav>
	);
};

export default Navbar;
