import React, { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const Home = () => {
	const [blogs, setBlogs] = useState(null);
	const [trendingBlogs, setTrendingBlogs] = useState(null);
	const [pageState, setPageState] = useState("home");
	const categories = ["tech", "sports", "programming", "travel", "game", "ai", "anime"];

	const fetchLatestBlogs = (page = 1) => {
		axios
			.post(`${import.meta.env.VITE_SERVER_DOMAIN}/latest-blogs`, { page })
			.then(async ({ data }) => {
				let formattedData = await filterPaginationData({
					state: blogs,
					data: data.blogs,
					page,
					countRoute: "/all-latest-blogs-count",
				});
				setBlogs(formattedData);
			})
			.catch((err) => console.log(err));
	};

	const fetchBlogsByCategory = (page = 1) => {
		axios
			.post(`${import.meta.env.VITE_SERVER_DOMAIN}/search-blogs`, { tag: pageState, page })
			.then(async ({ data }) => {
				let formattedData = await filterPaginationData({
					state: blogs,
					data: data.blogs,
					page,
					countRoute: "/search-blogs-count",
					dataToSend: { tag: pageState },
				});
				setBlogs(formattedData);
			})
			.catch((err) => console.log(err));
	};

	const fetchTrendingBlogs = () => {
		axios
			.get(`${import.meta.env.VITE_SERVER_DOMAIN}/trending-blogs`)
			.then(({ data }) => {
				setTrendingBlogs(data.blogs);
			})
			.catch((err) => console.log(err));
	};
	const loadBlogByCategory = (e) => {
		let category = e.target.innerText.toLowerCase();
		setBlogs(null);
		if (pageState === category) {
			setPageState("home");
			return;
		}
		setPageState(category);
	};
	useEffect(() => {
		if (pageState === "home") fetchLatestBlogs();
		if (pageState !== "home") fetchBlogsByCategory();
		if (!trendingBlogs) fetchTrendingBlogs();
	}, [pageState]);
	return (
		<AnimationWrapper>
			<section className="h-cover flex justify-center gap-10">
				{/* latest blogs */}
				<div className="w-full">
					<InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>
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
							<LoadMoreDataBtn
								state={blogs}
								fetchDataFunc={pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory}
							/>
						</>
						<>
							{trendingBlogs === null ? (
								<Loader />
							) : trendingBlogs.length ? (
								trendingBlogs.map((blog, i) => {
									return <MinimalBlogPost blog={blog} author={blog.author.personal_info} index={i} key={i} />;
								})
							) : (
								<NoDataMessage message="No trending blogs!" />
							)}
						</>
					</InPageNavigation>
				</div>
				{/* filter and trending blogs */}
				<div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 max-md:hidden pt-3">
					<div className="flex flex-col gap-10">
						<div>
							<h1 className="font-medium text-xl mb-8">Stories from all interests</h1>
							<div className="flex gap-3 flex-wrap">
								{categories.map((category, i) => {
									return (
										<button
											onClick={loadBlogByCategory}
											className={`tag ${pageState === category ? "bg-black text-white" : " "}`}
											key={i}>
											{category}
										</button>
									);
								})}
							</div>
						</div>
						<div>
							<h1 className="font-medium text-xl mb-8">
								Trending <i className="fi fi-rr-arrow-trend-up"></i>
							</h1>
							<>
								{trendingBlogs === null ? (
									<Loader />
								) : trendingBlogs.length ? (
									trendingBlogs.map((blog, i) => {
										return <MinimalBlogPost blog={blog} author={blog.author.personal_info} index={i} key={i} />;
									})
								) : (
									<NoDataMessage message="No trending blogs!" />
								)}
							</>
						</div>
					</div>
				</div>
			</section>
		</AnimationWrapper>
	);
};

export default Home;
