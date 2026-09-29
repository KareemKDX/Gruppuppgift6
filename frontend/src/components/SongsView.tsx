import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { type Song } from "../types/song";
import "../css/Startpage.css";
import "../css/HomePage.css";

type FilterType = "all" | "released" | "early_access";

type Props = {
  label: string;
  title: string;
  meta?: string;
  songs: Song[];
  userHasEarlyAccess: boolean;
  headerActions?: ReactNode;
};

function songDurationToString(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return minutes + "min " + seconds + "sec";
}

function SongsView({
  label,
  title,
  meta,
  songs,
  userHasEarlyAccess,
  headerActions,
}: Props) {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loadingSong, setLoadingSong] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  async function handleSongClick(id: number) {
    setLoadingSong(true);
    try {
      const res = await api.get(`/api/songs/${id}`);
      setSelectedSong(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSong(false);
    }
  }

  const filteredSongs = songs.filter((song) => {
    if (filter === "all") return true;
    return song.release_type === filter;
  });

  return (
    <div className="homepage-layout">
      <div className="homepage-menu-left">
        <div className="home-header">
          <div className="playlist-text">
            <span className="home-header-label">{label}</span>
          </div>

          <div className="home-header-info">
            <h1 className="home-header-title">{title}</h1>
            {headerActions}
            {meta && <p className="home-header-meta">{meta}</p>}
          </div>

          <div className="home-header-actions">
            <button className="play-button" aria-label="Play all">
              ▶
            </button>
            <button
              className={`btn header-action-button ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`btn header-action-button ${filter === "released" ? "active" : ""}`}
              onClick={() => setFilter("released")}
            >
              Released
            </button>
            <button
              className={`btn header-action-button ${filter === "early_access" ? "active" : ""}`}
              onClick={() => setFilter("early_access")}
            >
              Early access
            </button>
          </div>

          <div className="song-list">
            {filteredSongs.length === 0 && <p>No songs to show.</p>}

            {filteredSongs.map((song, index) => {
              const isLocked =
                song.release_type === "early_access" && !userHasEarlyAccess;
              const hasEarlyAccess =
                song.release_type === "early_access" && userHasEarlyAccess;

              return (
                <div
                  className={
                    isLocked
                      ? "song-card-locked"
                      : hasEarlyAccess
                        ? "song-card-early-access"
                        : "song-card"
                  }
                  key={song.id}
                  onClick={() => handleSongClick(song.id)}
                >
                  <div
                    className={
                      isLocked ? "song-row-left-locked" : "song-row-left"
                    }
                  >
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

                  <div className="song-row-right">
                    {isLocked && (
                      <p className="song-locked-text">Early access</p>
                    )}
                    {hasEarlyAccess && (
                      <p className="capital-style-text">EARLY ACCESS</p>
                    )}
                    {isLocked ? (
                      <Link to="/subscription" className="upgrade-btn">
                        Upgrade
                      </Link>
                    ) : (
                      <p className="song-row-duration-text">
                        {songDurationToString(song.duration)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="homepage-menu-right">
        {loadingSong ? (
          <p>Loading...</p>
        ) : selectedSong ? (
          <div className="home-right-header">
            <div className="selected-image-container">
              <img
                className="right-cover"
                src={selectedSong.image_url}
                alt={selectedSong.title}
              />
            </div>
            <div className="selected-song-header-content">
              <h2 className="selected-song-title">{selectedSong.title}</h2>
              <p className="selected-song-artist">{selectedSong.artist}</p>
              <p className="selected-song-duration">
                Duration: {songDurationToString(selectedSong.duration)}
              </p>
            </div>
          </div>
        ) : (
          <div className="home-right-header">
            <h4>No song selected.</h4>
          </div>
        )}
      </div>
    </div>
  );
}

export default SongsView;
