import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import './App.css'
import SneakerDetailsPage from "./pages/SneakerDetailsPage.jsx";
import SneakersListPage from "./pages/SneakersListPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sneaker/:id" element={<SneakerDetailsPage />} />
                <Route path="/shop" element={<SneakersListPage />} />
            </Routes>
        </Router>
    );
}

export default App
