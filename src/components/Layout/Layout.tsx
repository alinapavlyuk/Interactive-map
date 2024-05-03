import React from "react";
import Header from "./Header/Header.tsx";
import Footer from "./Footer/Footer.tsx";
import Content from "./Content/Content.tsx";
import "./layoutStyles.css";

type LayoutProps = {
  children: React.ReactNode;
  isLoading: boolean;
};

export default function Layout({ children, isLoading }: LayoutProps) {
  return (
    <div id="container">
      <Header />
      <Content>{isLoading ? <div>
        ...Loading
      </div>: children}</Content>
      <Footer />
    </div>
  );
}
