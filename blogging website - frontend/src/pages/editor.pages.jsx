import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import { EditorContext, EditorProvider } from "../context/EditorContext";

const Editor = () => {
	const { userAuth: { access_token } = {} } = useContext(UserContext);
	const { editorState } = useContext(EditorContext);
	console.log(editorState);
	return access_token === null ? (
		<Navigate to="/signin" />
	) : editorState === "editor" ? (
		<BlogEditor />
	) : (
		<PublishForm />
	);
};

export default Editor;
