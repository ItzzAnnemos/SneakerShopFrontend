import React from 'react';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SneakerList from "../components/SneakerList.jsx";

const SneakersListPage = () => {
    return (
        <div>
            <div className="bg-gray-50 dark:bg-gray-900 transition-colors min-h-screen flex flex-col">
                <Header/>
                <SneakerList/>
                <Footer/>
            </div>
        </div>
    );
}

export default SneakersListPage;