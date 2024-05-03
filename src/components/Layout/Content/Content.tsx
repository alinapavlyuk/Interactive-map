import React from "react";
import "./contentStyles.css";

type ContentProps = {
  children: React.ReactNode;
};

export default function Content({ children }: ContentProps) {
  return <main>{children}</main>;
}
