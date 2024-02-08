import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../context/UserContext";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import InPageNavigation from "../components/inpage-navigation.component";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import PageNotFound from "./404.page";

export const profileDataStructure = {
	personal_info: { fullName: "", username: "", profile_img: "", bio: "" },
	account_info: {
		total_posts: 0,
		total_reads: 0,
	},
	social_links: {},
	joinedAt: "",
};

const Profile = () => {
	const { id: profileId } = useParams();
	const [profile, setProfile] = useState(profileDataStructure);
	const [blogs, setBlogs] = useState(null);
	const [loading, setLoading] = useState(true);
	const [profileLoaded, setProfileLoaded] = useState("");
	const { userAuth: { username } = {} } = useContext(UserContext);

	const {
		personal_info: { fullName, username: profile_username, profile_img, bio },
		account_info: { total_posts, total_reads },
		social_links,
		joinedAt,
	} = profile;
	const fetchUserProfile = () => {
		axios
			.post(`${import.meta.env.VITE_SERVER_DOMAIN}/get-profile`, { username: profileId })
			.then(({ data: user }) => {
				if (user) setProfile(user);
				setProfileLoaded(profileId);
				getBlogs({ user_id: user._id });
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false);
			});
	};
	const getBlogs = ({ page = 1, user_id }) => {
		user_id = user_id === undefined ? blogs.user_id : user_id;
		axios
			.post(`${import.meta.env.VITE_SERVER_DOMAIN}/search-blogs`, { author: user_id, page })
			.then(async ({ data }) => {
				let formattedData = await filterPaginationData({
					state: blogs,
					data: data.blogs,
					page,
					countRoute: "/search-blogs-count",
					dataToSend: { author: user_id },
				});
				formattedData.user_id = user_id;

				setBlogs(formattedData);
			});
	};
	useEffect(() => {
		if (profileId !== profileLoaded) setBlogs(null);
		if (blogs === null) {
			resetState();
			fetchUserProfile();
		}
	}, [profileId, blogs]);

	const resetState = () => {
		setProfile(profileDataStructure);

		setProfileLoaded("");
		setLoading(true);
	};
	return (
		<AnimationWrapper>
			{loading ? (
				<Loader />
			) : profile_username.length ? (
				<section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
					<div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
						<img src={profile_img} alt="Profle Image" className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32" />
						<h1 className="text-2xl font-medium">@{profile_username}</h1>
						<p className="text-xl capitalize h-6">{fullName}</p>
						<p>
							{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads
						</p>
						<div className="flex gap-4 mt-2">
							{profileId === username ? (
								<Link to="/settings/edit/profile" className="btn-light rounded-md">
									Edit Profile
								</Link>
							) : (
								""
							)}
						</div>
						<AboutUser className="max-md:hidden" bio={bio} joinedAt={joinedAt} social_links={social_links} />
					</div>
					<div className="max-md:mt-12 w-full">
						<InPageNavigation routes={["Blogs Published", "About"]} defaultHidden={["About"]}>
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
								<LoadMoreDataBtn state={blogs} fetchDataFunc={getBlogs} />
							</>
							<AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
						</InPageNavigation>
					</div>
				</section>
			) : (
				<PageNotFound />
			)}
		</AnimationWrapper>
	);
};

export default Profile;
