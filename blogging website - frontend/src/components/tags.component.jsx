import React, { useContext } from "react";
import { EditorContext } from "../context/EditorContext";

const Tag = ({ tag }) => {
	const {
		blog,
		setBlog,
		blog: { tags },
	} = useContext(EditorContext);
	const handleTagDelete = () => {
		const updatedTags = tags.filter((t) => t !== tag);
		setBlog({ ...blog, tags: updatedTags });
	};
	return (
		<div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8">
			<p className="outline-none">{tag}</p>
			<button onClick={handleTagDelete} className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2">
				<i className="fi fi-rr-cross text-sm pointer-events-none"></i>
			</button>
		</div>
	);
};

export default Tag;
