import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/utils/Header";
import Footer from "../../components/utils/Footer";
import AgendaDashboard from "../../components/dashboard/agenda/AgendaDashboard";

const AgendaPage = () => {
  return (
    <>
      <Header />
      <AgendaDashboard />
      <Footer />
    </>
  );
};

export default AgendaPage;