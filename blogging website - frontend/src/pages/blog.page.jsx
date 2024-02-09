import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getMonthAndDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import { BlogContext } from "../context/BlogContext";

const Blog = () => {
	const { blog_id } = useParams();
	const { blog, setBlog } = useContext(BlogContext);
	const [loading, setLoading] = useState(true);

	const {
		title,
		content,
		banner,
		author: {
			personal_info: { fullName, username: author_username, profile_img },
		},
		publishedAt,
	} = blog;
	const fetchBlog = () => {
		axios
			.post(`${import.meta.env.VITE_SERVER_DOMAIN}/get-blog`, { blog_id })
			.then(({ data: { blog } }) => {
				setBlog(blog);
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};
	useEffect(() => {
		fetchBlog();
	}, []);
	return (
		<AnimationWrapper>
			{loading ? (
				<Loader />
			) : (
				<div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
					<img src={banner} className="aspect-video" />
					<div className="mt-12">
						<h2>{title}</h2>
						<div className="flex max-sm:flex-col justify-between my-8">
							<div className="flex gap-5 items-start">
								<img src={profile_img} className="w-12 h-12 rounded-full" />
								<p className="capitalize">
									{fullName} <br />@
									<Link className="underline" to={`/user/${author_username}`}>
										{author_username}
									</Link>
								</p>
							</div>
							<p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
								Published on {getMonthAndDay(publishedAt)}
							</p>
						</div>
					</div>
					<BlogInteraction />
				</div>
			)}
		</AnimationWrapper>
	);
};

export default Blog;
