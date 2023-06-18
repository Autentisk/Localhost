import React from "react";
import Header from "../components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import routes from "../config/routes";
import "./layout.css";
import ReviewItem from "../pages/ReviewItem";

const MainArea = styled.div`
  background-color: #f5f8fa;
  padding: 50px 50px 100px 100px;
`;

const Layout = () => {
  const pages = routes.map(route => <Route key={route.path} path={route.path} Component={route.Component}></Route>);
  return (
    <BrowserRouter>
      <Header></Header>
      <MainArea>
        <div className="centered-container">
          <Routes>{pages}</Routes>
        </div>
      </MainArea>
    </BrowserRouter>
  );
};

export default Layout;
