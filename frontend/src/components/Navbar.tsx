import { useState } from "react";
import type { User } from "../auth";
import { Link } from "react-router-dom";
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
            <Link
              to="/profile"
              className="btn btn-secondary-nav"
              onClick={handleLinkClick}
            >
              My Profile
            </Link>

            {user.role === "admin" && (
              <Link
                to="/admin"
                className="btn btn-secondary-nav"
                onClick={handleLinkClick}
              >
                Admin
              </Link>
            )}

            <Link
              to="/"
              className="btn btn-primary-nav"
              onClick={() => {
                handleLinkClick();
                onLogout();
              }}
            >
              Logout
            </Link>
          </>
        ) : (
          <Link
            to="/login"
            className="btn btn-secondary-nav"
            onClick={handleLinkClick}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
