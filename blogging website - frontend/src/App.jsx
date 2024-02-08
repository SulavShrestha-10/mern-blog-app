import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { UserProvider } from "./context/UserContext";
import Editor from "./pages/editor.pages";
import { EditorProvider } from "./context/EditorContext";
import Home from "./pages/home.page";
import Search from "./pages/search.page";
import PageNotFound from "./pages/404.page";

const App = () => {
	return (
		<UserProvider>
			<EditorProvider>
				<Routes>
					<Route path="/editor" element={<Editor />} />
					<Route path="/" element={<Navbar />}>
						<Route index element={<Home />} />
						<Route path="signin" element={<UserAuthForm type="sign-in" />} />
						<Route path="signup" element={<UserAuthForm type="sign-up" />} />
						<Route path="search/:query" element={<Search />} />
						<Route path="*" element={<PageNotFound />} />
					</Route>
				</Routes>
			</EditorProvider>
		</UserProvider>
	);
};

export default App;
