import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import { EditorContext, EditorProvider } from "../context/EditorContext";

const Editor = () => {
	const { userAuth: { access_token } = {} } = useContext(UserContext);
	const { editor } = useContext(EditorContext);
	console.log(editor);
	return access_token === null ? <Navigate to="/signin" /> : editor === "editor" ? <BlogEditor /> : <PublishForm />;
};

export default Editor;
