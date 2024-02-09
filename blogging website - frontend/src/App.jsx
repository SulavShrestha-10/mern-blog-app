import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { UserProvider } from "./context/UserContext";
import Editor from "./pages/editor.pages";
import { EditorProvider } from "./context/EditorContext";
import Home from "./pages/home.page";
import Search from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import Profile from "./pages/profile.page";
import Blog from "./pages/blog.page";
import { BlogProvider } from "./context/BlogContext";

const App = () => {
	return (
		<UserProvider>
			<EditorProvider>
				<BlogProvider>
					<Routes>
						<Route path="/editor" element={<Editor />} />
						<Route path="/" element={<Navbar />}>
							<Route index element={<Home />} />
							<Route path="signin" element={<UserAuthForm type="sign-in" />} />
							<Route path="signup" element={<UserAuthForm type="sign-up" />} />
							<Route path="search/:query" element={<Search />} />
							<Route path="user/:id" element={<Profile />} />
							<Route path="blog/:blog_id" element={<Blog />} />
							<Route path="*" element={<PageNotFound />} />
						</Route>
					</Routes>
				</BlogProvider>
			</EditorProvider>
		</UserProvider>
	);
};

export default App;
