import React from "react";
import { BrowserRouter, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "../../pages/Home";
import Profil from "../../pages/Profil";
import Trending from "../../pages/Trending";

const index = () => {
    return (
        <BrowserRouter>
        
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/profil' element={<Profil/>} />
                <Route path='/trending' element={<Trending/>} />
            </Routes>
       
        </BrowserRouter>
    );
};

export default index;