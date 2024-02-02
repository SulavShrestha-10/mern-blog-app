import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";

const Editor = () => {
	const { userAuth: { access_token } = {} } = useContext(UserContext);
	const [editor, setEditor] = useState("editor");
	return access_token === null ? <Navigate to="/signin" /> : editor === "editor" ? <BlogEditor /> : <PublishForm />;
};

export default Editor;
