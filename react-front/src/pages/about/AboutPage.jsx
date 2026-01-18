import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/utils/Header";
import Footer from "../../components/utils/Footer";
import About from "../../components/about/About";

const HomePage = () => {
  return (
    <>
      <Header />
      <About />
      <Footer />
    </>
  );
};

export default HomePage;