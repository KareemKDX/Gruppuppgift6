import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api, { PLAYLISTS_CHANGED } from "../lib/api";
import { type Song } from "../types/song";
import "../css/HomePage.css";
import "../css/PlaylistPage.css";

type Playlist = {
  id: number;
  name: string;
  songs: Song[];
};

function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [hasEarlyAccess, setHasEarlyAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/api/playlists/${id}`),
      api.get("/api/songs"),
      api.get("/api/profile"),
    ]).then(([playlistRes, songsRes, profileRes]) => {
        setPlaylist(playlistRes.data.playlist);
        setAllSongs(songsRes.data);
        setHasEarlyAccess(profileRes.data.user.early_access === true);
        setMessage("");
        setShowUpgrade(false);
      }).catch((err) => {
        console.log(err);
        setPlaylist(null);
      }).finally(() => setLoading(false));
  }, [id]);

  function showError(err: unknown, fallback: string) {
    const res = axios.isAxiosError(err) ? err.response : undefined;
    setMessage(res?.data?.message ?? fallback);
    setShowUpgrade(res?.status === 403);
  }

  async function addSong(song: Song) {
    try {
      await api.post(`/api/playlists/${id}/songs`, { song_id: song.id });
      setPlaylist((current) =>
        current && { ...current, songs: [...current.songs, song] },
      );
      setMessage("");
      window.dispatchEvent(new Event(PLAYLISTS_CHANGED));
    } catch (err) {
      showError(err, "Could not add song");
    }
  }

  async function removeSong(songId: number) {
    try {
      await api.delete(`/api/playlists/${id}/songs/${songId}`);
      setPlaylist((current) =>
        current && {
          ...current,
          songs: current.songs.filter((song) => song.id !== songId),
        },
      );
      setMessage("");
      window.dispatchEvent(new Event(PLAYLISTS_CHANGED));
    } catch (err) {
      showError(err, "Could not remove song");
    }
  }

  async function deletePlaylist() {
    if (!playlist || !confirm(`Delete "${playlist.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/playlists/${id}`);
      window.dispatchEvent(new Event(PLAYLISTS_CHANGED));
      navigate("/");
    } catch (err) {
      showError(err, "Could not delete playlist");
    }
  }

  if (loading) {
    return <p className="showcase-loading">Loading playlist...</p>;
  }

  if (!playlist) {
    return <p className="playlist-message">Playlist not found.</p>;
  }

  const songIdsInPlaylist = new Set(playlist.songs.map((song) => song.id));
  const songsToAdd = allSongs.filter((song) => !songIdsInPlaylist.has(song.id));

  return (
    <div className="homepage-layout">
      <div className="homepage-menu-left">
        <div className="home-header">
          <div className="playlist-text">
            <span className="home-header-label">Playlist</span>
          </div>
          <div className="home-header-info">
            <h1 className="home-header-title">{playlist.name}</h1>
            <p className="home-header-meta">{playlist.songs.length} tracks</p>
          </div>

          <div className="home-header-actions">
            <button
              className="btn header-action-button"
              onClick={deletePlaylist}
            >
              Delete playlist
            </button>
          </div>
        </div>

        {message && (
          <div className="playlist-message">
            <p>{message}</p>
            {showUpgrade && (
              <Link to="/subscription" className="upgrade-btn">
                Upgrade
              </Link>
            )}
          </div>
        )}

        <div className="song-list">
          {playlist.songs.length === 0 && (
            <p className="playlist-empty">
              No songs yet. Add some from the list.
            </p>
          )}

          {playlist.songs.map((song, index) => (
            <div className="song-card" key={song.id}>
              <div className="song-row-right">
                <span className="song-index">{index + 1}</span>
                <img
                  src={song.image_url}
                  alt={song.title}
                  className="song-row-cover"
                />
                <div className="song-row-info">
                  <span className="song-row-title">{song.title}</span>
                  <span className="song-row-artist">{song.artist}</span>
                </div>
              </div>

              <button
                className="playlist-song-button"
                onClick={() => removeSong(song.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="homepage-menu-right">
        <div className="playlist-add-songs">
          <h3>Add songs</h3>

          {songsToAdd.length === 0 && (
            <p className="playlist-empty">All songs are in this playlist.</p>
          )}

          {songsToAdd.map((song) => {
            const isLocked = song.release_type === "early_access" && !hasEarlyAccess;

            return (
              <div
                className={isLocked ? "song-card-locked" : "song-card"}
                key={song.id}
              >
                <div
                  className={isLocked ? "song-row-left-locked" : "song-row-right"}
                >
                  <img
                    src={song.image_url}
                    alt={song.title}
                    className="song-row-cover"
                  />
                  <div className="song-row-info">
                    <span className="song-row-title">{song.title}</span>
                    <span className="song-row-artist">{song.artist}</span>
                  </div>
                </div>

                {isLocked ? (
                  <Link to="/subscription" className="upgrade-btn">
                    Upgrade
                  </Link>
                ) : (
                  <button
                    className="playlist-song-button"
                    onClick={() => addSong(song)}
                  >
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PlaylistPage;
