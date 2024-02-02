import { createContext, useEffect, useState } from "react";

const blogStructure = {
	title: "",
	banner: "",
	content: [],
	tags: [],
	des: "",
	author: { personal_info: {} },
};

export const EditorContext = createContext({});
export const EditorProvider = ({ children }) => {
	const [blog, setBlog] = useState(blogStructure);
	const [editor, setEditor] = useState("editor");
	return <EditorContext.Provider value={{ blog, setBlog, setEditor, editor }}>{children}</EditorContext.Provider>;
};
