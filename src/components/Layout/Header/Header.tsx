import "./headerStyles.css";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <span>
        <a href="/">MyMap</a>
      </span>
      <ul>
        <li>
          <Link to="/map?mode=view">View</Link>
        </li>
        <li>
          <Link to="/map?mode=manage">Manage</Link>
        </li>
      </ul>
    </header>
  );
}
