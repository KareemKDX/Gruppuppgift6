import type { User } from "../auth";

type Props = {
  user: User;
  onLogout: () => void;
};

function Navbar({ user, onLogout }: Props) {
  return (
    <>
      <header className="navbar">
        <div className="navbar-logo">MusicPlate</div>
        <div className="navbar-search-bar">Searchbar</div>
        <div className="navbar-user">
          <span>{user.username}</span>
          <button className="navbar-logout" onClick={onLogout}>
            Logga ut
          </button>
        </div>
      </header>
    </>
  );
}

export default Navbar;
