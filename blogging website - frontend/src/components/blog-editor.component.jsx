import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import banner from "../imgs/blog banner.png";
import AnimationWrapper from "../common/page-animation";
import { toast } from "react-hot-toast";
import axios from "axios";

const BlogEditor = () => {
	const [bannerImg, setBannerImg] = useState();
	const handleBannerUpload = async (e) => {
		const serverRoute = "/upload-banner";
		try {
			const img = e.target.files && e.target.files[0];
			if (!img) {
				console.error("No image selected");
				return;
			}
			const formData = new FormData();
			formData.append("uploadBanner", img);
			formData.append("upload_preset", "MERNBlog");
			formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);
			console.log(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`);
			// Make a request to your backend route for Cloudinary image upload
			const response = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}${serverRoute}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			// Log the Cloudinary response
			console.log("Cloudinary Response:", response.data);
			// The response from the backend will contain the Cloudinary secure URL
			const imageUrl = response.data.secure_url;
			setBannerImg(imageUrl);
			toast.success("Image Uploaded");
		} catch (error) {
			toast.error("Error uploading image to Cloudinary:", error);
		}
	};
	return (
		<>
			<nav className="navbar">
				<Link to="/" className="flex-none w-10 ">
					<img src={logo} alt="Logo" />
				</Link>
				<p className="max-md:hidden text-black line-clamp-1 w-full">New Blog</p>
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
								<img src={bannerImg || banner} className="z-20" alt="Blog Banner" />
								<input type="file" accept=".png, .jpg, .jpeg" hidden id="uploadBanner" onChange={handleBannerUpload} />
							</label>
						</div>
					</div>
				</section>
			</AnimationWrapper>
		</>
	);
};

export default BlogEditor;
