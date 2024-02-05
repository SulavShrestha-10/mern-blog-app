import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./Schema/User.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import admin from "firebase-admin";
import cloudinary from "cloudinary";
import { getAuth } from "firebase-admin/auth";
import serviceAccKey from "./firebase-config.json" assert { type: "json" };
import multer from "multer";
import "dotenv/config";

const app = express();

let PORT = 4000;

admin.initializeApp({ credential: admin.credential.cert(serviceAccKey) });

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

// Multer setup for handling file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage: storage });

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// * Middlewares
app.use(express.json());
app.use(cors());
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

// * Authentication Flow

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
			if (!user.google_auth) {
				bcrypt.compare(password, user.personal_info.password, (err, result) => {
					if (err) return res.status(403).json({ error: "Error occurred while login, please try again!" });
					if (!result) {
						return res.status(403).json({ error: "Invalid credentials!" });
					} else {
						return res.status(200).json(formatDataToSend(user));
					}
				});
			} else {
				return res.status(403).json({ error: "Account was created using google, try logging in with google!" });
			}
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ error: err.message });
		});
});

// * Google Sign In
app.post("/google-auth", async (req, res) => {
	let { access_token } = req.body;
	getAuth()
		.verifyIdToken(access_token)
		.then(async (decodedUser) => {
			let { email, name, picture } = decodedUser;
			picture = picture.replace("s96-c", "s384-c");
			let user = await User.findOne({ "personal_info.email": email })
				.select("personal_info.fullName personal_info.username personal_info.profile_img google_auth")
				.then((u) => {
					return u || null;
				})
				.catch((err) => {
					return res.status(500).json({ error: err.message });
				});
			if (user) {
				if (!user.google_auth) {
					return res
						.status(403)
						.json({ error: "This account was registered without using google. Please login with email and password!" });
				}
			} else {
				let username = await generateUsername(email);
				user = new User({
					personal_info: {
						fullName: name,
						email,
						username,
					},
					google_auth: true,
				});
				await user
					.save()
					.then((u) => {
						user = u;
					})
					.catch((err) => {
						return res.status(500).json({ error: err.message });
					});
			}
			return res.status(200).json(formatDataToSend(user));
		})
		.catch((err) => {
			return res.status(500).json({ error: "Failed to authenticate with google!" });
		});
});

// * Upload Banner
app.post("/upload-banner", upload.single("file"), async (req, res) => {
	try {
		const result = await cloudinary.v2.uploader.upload(req.file.path);
		res.status(200).json({ secure_url: result.secure_url });
	} catch (error) {
		console.error("Error uploading image to Cloudinary:", error);
		res.status(500).json({ error: "Failed to upload image to Cloudinary" });
	}
});

app.listen(PORT, () => {
	console.log(`Listening on PORT -> ${PORT}`);
});
