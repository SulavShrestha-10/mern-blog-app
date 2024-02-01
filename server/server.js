import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import User from "./Schema/User.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

const app = express();

let PORT = 4000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// * Middlewares
app.use(express.json());

mongoose.connect(process.env.DB_URL, {
	autoIndex: true,
});

const formatDataToSend = (user) => {
	const access_token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
	return {
		access_token,
		profile_img: user.personal_info.profile_img,
		username: user.personal_info.username,
		fullName: user.personal_info.fullName,
	};
};

const generateUsername = async (email) => {
	let username = email.split("@")[0];
	let usernameExists = await User.exists({ "personal_info.username": username }).then((res) => res);
	usernameExists ? (username += nanoid().substring(0, 5)) : "";
	return username;
};

// * Sign Up Request
app.post("/signup", (req, res) => {
	let { fullName, email, password } = req.body;
	// * Validating data from front end
	if (fullName.length < 3) return res.status(403).json({ error: "Full name must be at least 3 letters long!" });
	if (!email.length) return res.status(403).json({ error: "Email required!" });
	if (!emailRegex.test(email)) return res.status(403).json({ error: "Email is invalid!" });
	if (!passwordRegex.test(password))
		return res
			.status(403)
			.json({ error: "Password must be 6 to 20 characters long with a numeric, uppercase and lowercase letters!" });
	bcrypt.hash(password, 10, async (err, hashedPassword) => {
		let username = await generateUsername(email);
		let user = new User({
			personal_info: { fullName, email, password: hashedPassword, username },
		});
		user
			.save()
			.then((u) => {
				return res.status(200).json({ user: formatDataToSend(u) });
			})
			.catch((err) => {
				if (err.code === 11000) return res.status(500).json({ error: "Email already exists!" });
				return res.status(500).json({ error: err.message });
			});
	});
});

// * Sign In Request
app.post("/signin", (req, res) => {
	let { email, password } = req.body;
	User.findOne({ "personal_info.email": email })
		.then((user) => {
			if (!user) {
				return res.status(403).json({ error: "Invalid credentials!" });
			}
			bcrypt.compare(password, user.personal_info.password, (err, result) => {
				if (err) return res.status(403).json({ error: "Error occurred while login, please try again!" });
				if (!result) {
					return res.status(403).json({ error: "Invalid credentials!" });
				} else {
					return res.status(200).json({ user: formatDataToSend(user) });
				}
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ error: err.message });
		});
});

app.listen(PORT, () => {
	console.log(`Listening on PORT -> ${PORT}`);
});
