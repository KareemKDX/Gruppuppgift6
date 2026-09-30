import { useState } from "react";
import type { User } from "../auth";
import { NavLink, Link } from "react-router-dom";
import "../css/Navbar.css";

type Props = {
  user: User | null;
  onLogout: () => void;
};

function Navbar({ user, onLogout }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function handleLinkClick() {
    setIsOpen(false);
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
        MusicPlate
      </Link>

      <div className="navbar-search-bar">
        <input type="text" placeholder="Search songs, artists..." />
      </div>

      <button
        className="navbar-menu-toggle"
        aria-label="Toggle menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div className={isOpen ? "navbar-user navbar-user-open" : "navbar-user"}>
        {user ? (
          <>
            <span>{user.username}</span>
            <NavLink
              to="/profile"
              className="btn btn-secondary-nav"
              onClick={handleLinkClick}
            >
              My Profile
            </NavLink>

            {user.role === "admin" && (
              <NavLink
                to="/admin"
                className="btn btn-secondary-nav"
                onClick={handleLinkClick}
              >
                Admin
              </NavLink>
            )}

            <NavLink
              to="/"
              className="btn btn-primary-nav"
              onClick={() => {
                handleLinkClick();
                onLogout();
              }}
            >
              Logout
            </NavLink>
          </>
        ) : (
          <NavLink
            to="/login"
            className="btn btn-secondary-nav"
            onClick={handleLinkClick}
          >
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Navbar;
