import WebFont from 'webfontloader';
import './App.css';
import Spline from '@splinetool/react-spline';
import {useEffect} from "react";
import MyButton from "./components/button/MyButton"
import MemberCard from "./components/memberCard/MemberCard";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from "./pages/home";
import Planetarium from "./planets";
function App() {


return (
	<BrowserRouter>
		<Routes>
<Route path='/' element={<Home/>}>
</Route>
			<Route path='/planetarium' element={<Planetarium/>}>
			</Route>
		</Routes>
	</BrowserRouter>

);
}

export default App;
