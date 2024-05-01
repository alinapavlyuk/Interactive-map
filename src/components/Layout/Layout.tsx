import React from "react";
import Header from "./Header/Header.tsx";
import Footer from "./Footer/Footer.tsx";
import Content from "./Content/Content.tsx";
import "./layoutStyles.css";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div id="container">
      <Header />
      <Content>{children}</Content>
      <Footer />
    </div>
  );
}
