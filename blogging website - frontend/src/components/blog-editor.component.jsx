import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import DefaultBanner from "../imgs/blog banner.png";
import AnimationWrapper from "../common/page-animation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { EditorContext } from "../context/EditorContext";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";

const BlogEditor = () => {
	const {
		blog,
		blog: { title, banner, content, tags, des },
		setBlog,
	} = useContext(EditorContext);

	useEffect(() => {
		let editor = new EditorJS({
			holderId: "textEditor",
			data: "",
			placeholder: "Let's write a awesome story",
			tools: tools,
		});
	}, []);

	const handleBannerUpload = async (e) => {
		const serverRoute = "/upload-banner";
		try {
			const img = e.target.files && e.target.files[0];
			if (!img) {
				toast.error("No image selected");
				return;
			}
			let loadingToast = toast.loading("Uploading...");
			const formData = new FormData();
			formData.append("uploadBanner", img);
			formData.append("upload_preset", "MERNBlog");
			formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);
			// Make a request to your backend route for Cloudinary image upload
			const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			// The response from the backend will contain the Cloudinary secure URL
			const imageUrl = response.data.secure_url;
			toast.dismiss(loadingToast);
			setBlog({ ...blog, banner: imageUrl });

			toast.success("Image Uploaded");
		} catch (error) {
			toast.error("Error uploading image to Cloudinary");
		}
	};
	const handleTitleKeyDown = (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();
		}
	};
	const handleTitleChange = (e) => {
		let input = e.target;
		input.style.height = "auto";
		input.style.height = `${input.scrollHeight}px`;
		setBlog({ ...blog, title: input.value });
	};
	return (
		<>
			<nav className="navbar">
				<Link to="/" className="flex-none w-10 ">
					<img src={logo} alt="Logo" />
				</Link>
				<p className="max-md:hidden text-black line-clamp-1 w-full">{title.length ? title : "New Blog"}</p>
				<div className="flex ml-auto gap-4">
					<button className="btn-dark py-2">Publish</button>
					<button className="btn-light py-2">Save Draft</button>
				</div>
			</nav>
			<AnimationWrapper>
				<section>
					<div className="mx-auto max-w-[900px] w-full">
						<div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
							<label htmlFor="uploadBanner">
								<img src={banner || DefaultBanner} className="z-20" alt="Blog Banner" />
								<input type="file" accept=".png, .jpg, .jpeg" hidden id="uploadBanner" onChange={handleBannerUpload} />
							</label>
						</div>
						<textarea
							placeholder="Blog Title"
							name=""
							className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
							onKeyDown={handleTitleKeyDown}
							onChange={handleTitleChange}></textarea>
						<hr className="w-full opacity-10 my-5" />
						<div id="textEditor" className="font-gelasio"></div>
					</div>
				</section>
			</AnimationWrapper>
		</>
	);
};

export default BlogEditor;
