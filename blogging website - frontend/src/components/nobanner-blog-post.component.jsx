import React from "react";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import { getMonthAndDay } from "../common/date";

const MinimalBlogPost = ({ blog, index, author }) => {
	const { publishedAt, title, blog_id: id } = blog;
	const { fullName, username, profile_img } = author;
	return (
		<AnimationWrapper transition={{ duration: 1, delay: index * 0.1 }}>
			<Link to={`blog/${id}`} className="flex gap-8 border-b border-grey pb-5 mb-4">
				<h1 className="blog-index">
					{(index + 1).toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })}
				</h1>
				<div>
					<div className="flex gap-2 items-center mb-8">
						<img src={profile_img} alt="Profile" className="w-6 h-6 rounded-full" />
						<p className="line-clamp-1">
							{fullName} @{username}
						</p>
						<p className="min-w-fit">{getMonthAndDay(publishedAt)}</p>
					</div>
					<h1 className="blog-title">{title}</h1>
				</div>
			</Link>
		</AnimationWrapper>
	);
};

export default MinimalBlogPost;
