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
        <div className="navbar-logo">MusicPlate</div>

        <div className="navbar-search-bar">Searchbar</div>

        <div className="navbar-user">
          {user ? (
            <>
              <span>{user.username}</span>
              <Link to="/profile" className="btn btn-secondary-nav">
                My Profile
              </Link>

              <button className="btn btn-primary-nav" onClick={onLogout}>
                Logga ut
              </button>
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
