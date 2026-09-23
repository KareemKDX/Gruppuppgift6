import type { User } from "../auth";
import { Link } from "react-router-dom";
import "../css/Navbar.css";

type Props = {
  user: User | null;
  onLogout: () => void;
};

function Navbar({ user, onLogout }: Props) {
  return (
    <>
      <header className="navbar">
        <Link to="/" className="navbar-logo">
          MusicPlate
        </Link>

        <div className="navbar-search-bar">
          <input type="text" placeholder="Search songs, artists..." />
        </div>

        <div className="navbar-user">
          {user ? (
            <>
              <span>{user.username}</span>
              <Link to="/profile" className="btn btn-secondary-nav">
                My Profile
              </Link>

              {user.role === "admin" && (
                <Link to="/admin" className="btn btn-secondary-nav">
                  Admin
                </Link>
              )}

              <Link to="/" className="btn btn-primary-nav" onClick={onLogout}>
                Logout
              </Link>
            </>
          ) : (
            <Link to="/login" className="btn btn-secondary-nav">
              Login
            </Link>
          )}
        </div>
      </header>
    </>
  );
}

export default Navbar;
