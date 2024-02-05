import React, { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { toast } from "react-hot-toast";
import { EditorContext } from "../context/EditorContext";
import Tag from "./tags.component";

const PublishForm = () => {
	const {
		blog,
		setBlog,
		blog: { title, banner, content, tags, des },
		setEditorState,
	} = useContext(EditorContext);
	let characterLimit = 200;
	let tagLimit = 10;
	const handleTitleChange = (e) => {
		let input = e.target;
		input.style.height = "auto";
		input.style.height = `${input.scrollHeight}px`;
		setBlog({ ...blog, title: input.value });
	};
	const handleDescriptionChange = (e) => {
		let input = e.target;
		setBlog({ ...blog, des: input.value });
	};
	const handleTitleKeyDown = (e) => {
		if (e.keyCode === 13) {
			e.preventDefault();
		}
	};
	const handleTagKeyDown = (e) => {
		if (e.keyCode === 13 || e.keyCode === 188) {
			e.preventDefault();
			let tag = e.target.value;
			if (tags.length < tagLimit) {
				if (!tags.includes(tag) && tag.length) setBlog({ ...blog, tags: [...tags, tag] });
			} else {
				toast.error(`You can add  max ${tagLimit} tags!`);
			}
			e.target.value = "";
		}
	};
	const handleClose = () => {};
	return (
		<AnimationWrapper>
			<section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16">
				<button
					className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
					onClick={() => setEditorState("editor")}>
					<i className="fi fi-rr-cross"></i>
				</button>
				<div className="max-w-[550px] center">
					<p className="text-dark-grey mb-1">Preview</p>
					<div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
						<img src={banner} alt="" />
					</div>
					<h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
					<p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
				</div>
				<div className="border-grey lg:border-1 lg:pl-8">
					<p className="text-dark-grey mb-2 mt-9">Blog Title</p>
					<input
						className="input-box pl-4"
						type="text"
						placeholder="Blog Title"
						defaultValue={title}
						onChange={handleTitleChange}
					/>
					<p className="text-dark-grey mb-2 mt-9">Short description about your blog</p>
					<textarea
						maxLength={characterLimit}
						defaultValue={des}
						className="h-40 resize-none leading-7 input-box pl-4"
						onChange={handleDescriptionChange}
						onKeyDown={handleTitleKeyDown}></textarea>
					<p className="mt-1 text-dark-grey text-right text-sm">{characterLimit - des.length} characters left!</p>
					<p>Topics - ( Helps in searching your blog! )</p>
					<div className="relative input-box pl-2 py-2 pb-4">
						<input
							type="text"
							placeholder="Topic"
							className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
							onKeyDown={handleTagKeyDown}
						/>
						{tags.map((tag) => {
							return <Tag tag={tag} key={tag} />;
						})}
					</div>
					<p className="mt-1 text-dark-grey text-right text-sm">{tagLimit - tags.length} Tags left!</p>
					<button className="btn-dark px-8">Publish</button>
				</div>
			</section>
		</AnimationWrapper>
	);
};

export default PublishForm;
