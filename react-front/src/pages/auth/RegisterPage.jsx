import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/utils/Header";
import Footer from "../../components/utils/Footer";
import Register from "../../components/auth/register/Register"

const HomePage = () => {
  return (
    <>
      <Header />
      <Register />
      <Footer />
    </>
  );
};

export default HomePage;