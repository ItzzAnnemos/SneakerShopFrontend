import SneakerList from "../components/SneakerList.jsx";
import Header from "../components/Header.jsx";
import HeroSection from "../components/HeroSection.jsx";
import Footer from "../components/Footer.jsx";


const Home = () => {

    return (
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 transition-colors">
            <Header/>
            <HeroSection/>
            <SneakerList/>
            <Footer/>
        </div>
    );
};

export default Home;
