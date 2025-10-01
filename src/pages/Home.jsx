import SneakerList from "../components/SneakerList.jsx";
import Header from "../components/Header.jsx";
import HeroSection from "../components/HeroSection.jsx";
import Footer from "../components/Footer.jsx";
import SneakerCarousel from "../components/SneakerCarousel.jsx";

const Home = () => {

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors flex flex-col gap-10">
            <Header/>
            <HeroSection/>
            {/*<SneakerCarousel/>*/}
            <Footer/>
        </div>
    );
};

export default Home;
