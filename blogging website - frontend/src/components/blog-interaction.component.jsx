import React, { useContext } from "react";
import { BlogContext } from "../context/BlogContext";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const BlogInteraction = () => {
	const {
		blog: {
			title,
			blog_id,
			activity,
			activity: { total_likes, total_comments },
			author: {
				personal_info: { username: author_username },
			},
		},
		setBlog,
	} = useContext(BlogContext);
	const {
		userAuth: { username },
	} = useContext(UserContext);
	return (
		<>
			<hr className="border-grey my-2" />
			<div className="flex gap-6 justify-between">
				<div className="flex items-center gap-3">
					<button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80 ">
						<i className="fi fi-rr-heart"></i>
					</button>
					<p className="text-xl text-dark-grey">{total_likes}</p>
					<button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80 ">
						<i className="fi fi-rr-comment-dots"></i>
					</button>
					<p className="text-xl text-dark-grey">{total_comments}</p>
				</div>
				<div className="flex gap-6 items-center">
					{username === author_username ? (
						<Link className="underline hover:text-purple" to={`/editor/${blog_id}`}>
							Edit
						</Link>
					) : (
						""
					)}
					<Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.hr}`}>
						<i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
					</Link>
				</div>
			</div>
			<hr className="border-grey my-2" />
		</>
	);
};

export default BlogInteraction;
