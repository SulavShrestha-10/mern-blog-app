import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { UserProvider } from "./context/UserContext";
import Editor from "./pages/editor.pages";
import { EditorProvider } from "./context/EditorContext";

const App = () => {
	return (
		<UserProvider>
			<EditorProvider>
				<Routes>
					<Route path="/editor" element={<Editor />} />
					<Route path="/" element={<Navbar />}>
						<Route path="signin" element={<UserAuthForm type="sign-in" />} />
						<Route path="signup" element={<UserAuthForm type="sign-up" />} />
					</Route>
				</Routes>
			</EditorProvider>
		</UserProvider>
	);
};

export default App;
