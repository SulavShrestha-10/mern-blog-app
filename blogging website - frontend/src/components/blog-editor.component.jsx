import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import DefaultBanner from "../imgs/blog banner.png";
import AnimationWrapper from "../common/page-animation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { EditorContext } from "../context/EditorContext";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const BlogEditor = () => {
	const {
		blog,
		blog: { title, banner, content, tags, des },
		setBlog,
		textEditor,
		setTextEditor,
		setEditorState,
	} = useContext(EditorContext);
	const { userAuth } = useContext(UserContext);
	const { access_token = {} } = userAuth || {};
	const navigate = useNavigate();
	useEffect(() => {
		if (!textEditor.isReady) {
			setTextEditor(
				new EditorJS({
					holderId: "textEditor",
					data: content,
					placeholder: "Let's write a awesome story",
					tools: tools,
				}),
			);
		}
	}, []);
	const publishBlog = () => {
		if (!banner.length) return toast.error("Upload a blog banner to publish the blog!");
		if (!title.length) return toast.error("Write blog title to publish the blog!");
		if (textEditor.isReady) {
			textEditor
				.save()
				.then((data) => {
					if (data.blocks.length) {
						setBlog({ ...blog, content: data });
						setEditorState("publish");
					} else {
						toast.error("Write something in your blog to publish it!");
					}
				})
				.catch((err) => console.log(err));
		}
	};
	const handleBannerUpload = async (e) => {
		const serverRoute = "/upload-banner";
		try {
			const img = e.target.files && e.target.files[0];
			console.log(img);
			if (!img) {
				toast.error("No image selected");
				return;
			}
			let loadingToast = toast.loading("Uploading...");
			const formData = new FormData();
			formData.append("file", img);
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
	const handleSaveDraft = (e) => {
		e.preventDefault();
		if (e.target.className.includes("disable")) return;
		if (!title.length) return toast.error("Write blog title before saving it as a draft!");
		let loadingToast = toast.loading("Saving as draft...");
		e.target.classList.add("disable");
		if (textEditor.isReady) {
			textEditor.save().then((content) => {
				let blogObject = { title, banner, content, des, tags, draft: true };
				console.log(blogObject);
				axios
					.post(`${import.meta.env.VITE_SERVER_DOMAIN}/create-blog`, blogObject, {
						headers: {
							Authorization: `Bearer ${access_token}`,
						},
					})
					.then(() => {
						e.target.classList.remove("disable");
						toast.dismiss(loadingToast);
						toast.success("Blog saved as draft!");
						setTimeout(() => {
							navigate("/");
							setEditorState("editor");
						}, 500);
					})
					.catch(({ response }) => {
						e.target.classList.remove("disable");
						toast.dismiss(loadingToast);
						return toast.error(response.data.error);
					});
			});
		}
	};
	return (
		<>
			<nav className="navbar">
				<Link to="/" className="flex-none w-10 ">
					<img src={logo} alt="Logo" />
				</Link>
				<p className="max-md:hidden text-black line-clamp-1 w-full">{title.length ? title : "New Blog"}</p>
				<div className="flex ml-auto gap-4">
					<button className="btn-dark py-2" onClick={publishBlog}>
						Publish
					</button>
					<button className="btn-light py-2" onClick={handleSaveDraft}>
						Save Draft
					</button>
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
							defaultValue={title}
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
