import { createContext, useState } from "react";

export const blogDataStructure = {
	title: "",
	banner: "",
	des: "",
	content: [],
	tags: [],
	author: {
		personal_info: {
			fullName: "",
			username: "",
			profile_img: "",
		},
	},
	publishedAt: "",
};

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
	const [blog, setBlog] = useState(blogDataStructure);
	return <BlogContext.Provider value={{ blog, setBlog }}>{children}</BlogContext.Provider>;
};
