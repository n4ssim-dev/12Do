import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/utils/Header";
import Footer from "../../components/utils/Footer";
import Hero from "../../components/home/HomeHero";

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Footer />
    </>
  );
};

export default HomePage;