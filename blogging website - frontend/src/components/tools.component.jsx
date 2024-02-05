import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import axios from "axios";

const uploadImage = async (img) => {
	const serverRoute = "/upload-banner";
	try {
		if (!img) {
			console.log("No image selected");
			return;
		}
		const formData = new FormData();
		formData.append("file", img);
		formData.append("upload_preset", "BlogImage");
		formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);
		console.log(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`);
		// Make a request to your backend route for Cloudinary image upload
		const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		// The response from the backend will contain the Cloudinary secure URL
		return response.data.secure_url;
	} catch (error) {
		console.log("Error uploading image to Cloudinary", error);
	}
};
const uploadImageByURL = (e) => {
	let link = new Promise((resolve, reject) => {
		try {
			resolve(e);
		} catch (err) {
			reject(err);
		}
	});
	return link.then((url) => {
		return {
			success: 1,
			file: { url },
		};
	});
};

const uploadImageByFile = (e) => {
	return uploadImage(e).then((url) => {
		if (url) {
			return {
				success: 1,
				file: { url },
			};
		}
	});
};
export const tools = {
	embed: Embed,
	list: {
		class: List,
		inlineToolbar: true,
	},
	image: {
		class: Image,
		config: {
			uploader: {
				uploadByUrl: uploadImageByURL,
				uploadByFile: uploadImageByFile,
			},
		},
	},
	header: {
		class: Header,
		config: {
			placeholder: "Type Heading...",
			levels: [2, 3],
			defaultLevel: 2,
		},
	},
	quote: {
		class: Quote,
		inlineToolbar: true,
	},
	marker: Marker,
	inlineCode: InlineCode,
};
