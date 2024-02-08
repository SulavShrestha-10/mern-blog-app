import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import LoadMoreDataBtn from "../components/load-more.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import axios from "axios";
import UserCard from "../components/usercard.component";

const Search = () => {
	const { query } = useParams();
	const [blogs, setBlogs] = useState(null);
	const [users, setUsers] = useState(null);
	const searchBlogs = ({ page = 1, create_new_arr = false }) => {
		axios
			.post(`${import.meta.env.VITE_SERVER_DOMAIN}/search-blogs`, { query, page })
			.then(async ({ data }) => {
				let formattedData = await filterPaginationData({
					state: blogs,
					data: data.blogs,
					page,
					countRoute: "/search-blogs-count",
					dataToSend: { query },
					create_new_arr,
				});
				setBlogs(formattedData);
			})
			.catch((err) => console.log(err));
	};
	const fetchUsers = () => {
		axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/search-users`, { query }).then(({ data: { users } }) => {
			setUsers(users);
		});
	};
	useEffect(() => {
		resetState();
		searchBlogs({ create_new_arr: true });
		fetchUsers();
	}, [query]);

	const resetState = () => {
		setBlogs(null);
		setUsers(null);
	};

	const UserCardWrapper = () => {
		return (
			<>
				{users === null ? (
					<Loader />
				) : users.length ? (
					users.map((user, i) => {
						return <UserCard key={i} index={i} user={user} />;
					})
				) : (
					<NoDataMessage message="No user found!" />
				)}
			</>
		);
	};
	return (
		<section className="h-cover flex justify-center gap-10">
			<div className="w-full">
				<InPageNavigation
					routes={[`Search results for ${query}`, "Accounts Matched"]}
					defaultHidden={["Accounts Matched"]}>
					<>
						{blogs === null ? (
							<Loader />
						) : blogs.results.length ? (
							blogs.results.map((blog, i) => {
								return <BlogPostCard blog={blog} author={blog.author.personal_info} index={i} key={i} />;
							})
						) : (
							<NoDataMessage message="No blogs published!" />
						)}
						<LoadMoreDataBtn state={blogs} fetchDataFunc={searchBlogs} />
					</>
					<UserCardWrapper />
				</InPageNavigation>
			</div>
			<div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
				<h1 className="font-medium text-xl mb-8 flex items-center gap-1">
					Users related to search <i className="fi fi-rr-user"></i>
				</h1>
				<UserCardWrapper />
			</div>
		</section>
	);
};

export default Search;
