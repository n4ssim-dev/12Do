import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/utils/Header";
import Footer from "../../components/utils/Footer";
import TodoTable from "../../components/dashboard/todolist/TodoTable"

const HomePage = () => {
  return (
    <>
      <Header />
      <TodoTable />
      <Footer />
    </>
  );
};

export default HomePage;