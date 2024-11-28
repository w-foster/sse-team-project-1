import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import Graphing from "./pages/graphing";
import "./App.css";

function App() {

	return (
		<div className="App">
			<Routes>
				<Route path="/react" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/graphing" element={<Graphing />} />
			</Routes>
		</div>
	);
}

export default App;