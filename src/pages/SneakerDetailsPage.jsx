import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SneakerDetails from "../components/SneakerDetails.jsx";
import {useParams} from "react-router-dom";

const SneakerDetailsPage = () => {
    const { id } = useParams(); // Get the ID from the URL

    return (
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 transition-colors">
            <Header/>
            <SneakerDetails sneakerId={id}/>
            <Footer/>
        </div>
    );
}

export default SneakerDetailsPage;