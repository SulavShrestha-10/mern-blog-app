import { createContext, useEffect, useState } from "react";

export const blogStructure = {
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
	const [editorState, setEditorState] = useState("editor");
	const [textEditor, setTextEditor] = useState({ isReady: false });
	return (
		<EditorContext.Provider value={{ blog, setBlog, setEditorState, editorState, textEditor, setTextEditor }}>
			{children}
		</EditorContext.Provider>
	);
};
