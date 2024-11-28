import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Footer from "./Footer";
import axios from "axios";
import DataProvider from "./Component/Store/Store";
axios.defaults.baseURL = "http://localhost:3000";
function App() {
  return (
    <>
      <DataProvider>
        <Header></Header>
        <Outlet></Outlet>
        <Footer></Footer>
      </DataProvider>
    </>
  );
}

export default App;
