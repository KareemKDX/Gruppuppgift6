import "../css/Startpage.css";
import "../css/HomePage.css";
import { type Song } from "../types/song";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loadingSong, setLoadingSong] = useState(false);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const res = await api.get("/api/songs");

        const data = res.data;
        console.log(data);
        setSongs(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  async function handleSongClick(id: number) {
    setLoadingSong(true);
    try {
      const res = await api.get(`/api/songs/${id}`);
      setSelectedSong(res.data);
      console.log("handleSongClick called.");
      console.log(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSong(false);
    }
  }

  function songDurationToString(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const timeString = minutes + "min " + seconds + "sec";

    return timeString;
  }

  if (loading) {
    return <p className="showcase-loading">Loading tracks...</p>;
  }

  return (
    <div className="homepage-layout">
      <div className="homepage-menu-left">
        <div className="home-header">
          <div className="playlist-text">
            <span className="home-header-label">Playlist</span>
          </div>
          <div className="home-header-info">
            <h1 className="home-header-title">MINA LÅTAR</h1>
          </div>

          <div className="home-header-actions">
            <button className="play-button" aria-label="Play all">
              ▶
            </button>
          </div>

          <div className="song-list">
            {songs.map((song, index) => (
              <div
                className="song-card"
                key={song.id}
                onClick={() => handleSongClick(song.id)}
              >
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

                <div className="song-row-right">
                  <p className="song-row-duration-text">
                    {songDurationToString(song.duration)}
                  </p>
                </div>
              </div>
            ))}
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
                src={selectedSong.image_url}
                alt={selectedSong.title}
                className="right-cover"
              />

              <div className="selected-song-header-content">
                <h2 className="selected-song-title">{selectedSong.title}</h2>
                <p className="selected-song-artist">{selectedSong.artist}</p>
                <p>{songDurationToString(selectedSong.duration)}</p>
              </div>
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

export default HomePage;
