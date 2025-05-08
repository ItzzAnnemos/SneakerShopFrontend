import SneakerList from "../components/SneakerList.jsx";
import Header from "../components/Header.jsx";
import HeroSection from "../components/HeroSection.jsx";
import Footer from "../components/Footer.jsx";


const Home = () => {

    return (
        <div>
            <Header/>
            <HeroSection/>
            <SneakerList/>
            <Footer/>
        </div>
    );
};

export default Home;
