import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import './App.css'
import SneakerDetailsPage from "./pages/SneakerDetailsPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sneaker/:id" element={<SneakerDetailsPage />} />
            </Routes>
        </Router>
    );
}

export default App
