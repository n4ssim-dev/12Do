import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/utils/Header";
import Footer from "../../components/utils/Footer";
import Login from "../../components/auth/login/Login"

const HomePage = () => {
  return (
    <>
      <Header />
      <Login />
      <Footer />
    </>
  );
};

export default HomePage;