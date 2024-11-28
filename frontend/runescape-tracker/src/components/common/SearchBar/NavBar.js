import React from "react";
import { Link } from "react-router-dom";
import './styles/NavBar.css';

const NavBar = (props) => {
  const { active } = props;

  return (
    <React.Fragment>
      <div className="nav-container">
        <nav className="navbar">
          <div className="nav-background">
            <ul className="nav-list">
              <li
                className={active === "home" ? "nav-item active" : "nav-item"}
              >
                <Link to="/react">Dashboard</Link>
              </li>
              <li
                className={active === "about" ? "nav-item active" : "nav-item"}
              >
                <Link to="/about">About</Link>
              </li>
              {/* Add more items here as needed */}
            </ul>
          </div>
        </nav>
      </div>
    </React.Fragment>
  );
};

export default NavBar;
