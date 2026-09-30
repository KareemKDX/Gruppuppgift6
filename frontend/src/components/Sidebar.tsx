import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import api, { PLAYLISTS_CHANGED } from "../lib/api";
import "../css/Sidebar.css";

type Playlist = {
  id: number;
  name: string;
  song_count: number;
};

type ContentPage = {
  id: number;
  title: string;
  required_subscription_name: string;
};

function Sidebar({ loggedIn }: { loggedIn: boolean }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    const loadPlaylists = () => {
      api
        .get("/api/playlists")
        .then((res) => setPlaylists(res.data.playlists))
        .catch((err) => console.log(err));
    };

    loadPlaylists();
    api.get("/api/content-pages").then((res) => setPages(res.data)).catch((err) => console.log(err));
    window.addEventListener(PLAYLISTS_CHANGED, loadPlaylists);
    return () => window.removeEventListener(PLAYLISTS_CHANGED, loadPlaylists);
  }, [loggedIn]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLimitReached(false);

    try {
      const res = await api.post("/api/playlists", { name });
      setPlaylists([...playlists, res.data.playlist]);
      setName("");
      setCreating(false);
      navigate(`/playlists/${res.data.playlist.id}`);
    } catch (err) {
      const res = axios.isAxiosError(err) ? err.response : undefined;
      setError(res?.data?.message ?? "Could not create playlist");
      setLimitReached(res?.status === 403);
    }
  }

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-wrapper">
          <div className="sidebar-header">
            <div className="sidebar-header-text">Library</div>
            {loggedIn && (
              <button
                className="sidebar-add-playlist"
                aria-label="Create playlist"
                onClick={() => setCreating(!creating)}
              >
                <h4>+</h4>
              </button>
            )}
          </div>

          {loggedIn && (
            <>
              {creating && (
                <form className="sidebar-create-form" onSubmit={handleCreate}>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Playlist name"
                    maxLength={150}
                    required
                    autoFocus
                  />
                  <button type="submit" className="btn create-playlist-btn">
                    Create
                  </button>
                </form>
              )}

              {error && (
                <div className="sidebar-error">
                  <p>{error}</p>
                  {limitReached && (
                    <Link to="/subscription" className="upgrade-btn">
                      Upgrade
                    </Link>
                  )}
                </div>
              )}

              <div className="sidebar-item-container">
                {playlists.map((playlist) => (
                  <NavLink
                    to={`/playlists/${playlist.id}`}
                    className="sidebar-playlist-card"
                    key={playlist.id}
                  >
                    <div className="playlist-header">
                      <h4>{playlist.name}</h4>
                    </div>
                    <div className="playlist-info">
                      <div className="playlist-song-amount">
                        {playlist.song_count} tracks
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>

              <div className="sidebar-header">
                <div className="sidebar-header-text">Pages</div>
              </div>

              <div className="sidebar-item-container">
                {pages.map((page) => (
                  <NavLink
                    to={`/pages/${page.id}`}
                    className="sidebar-playlist-card"
                    key={page.id}
                  >
                    <div className="playlist-header">
                      <h4>{page.title}</h4>
                    </div>
                    <div className="playlist-info">
                      <div className="playlist-song-amount">
                        {page.required_subscription_name}
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
