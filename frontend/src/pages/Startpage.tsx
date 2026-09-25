import "../css/Startpage.css";
import { type Song } from "../types/song";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

function Startpage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const res = await api.get<Song[]>("/api/songs");

        const data = res.data;
        console.log(data);
        setSongs(data.slice(0, 6));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  if (loading) {
    return <p className="showcase-loading">Loading tracks...</p>;
  }

  return (
    <div className="showcase-container">
      <div className="startpage-intro">
        <p className="showcase-header">
          Explore & listen to songs created around the world...
        </p>
        <div className="showcase-account-container">
          <div>
            <Link to="/register" className="btn btn-primary">
              Create account
            </Link>
          </div>
          <div>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="startpage-tracks-container">
        <h2>Top Artists</h2>

        <div className="artist-grid">
          {songs.map((song) => (
            <div className="artist-card" key={song.id}>
              <img
                src={song.image_url}
                alt={song.title}
                className="artist-cover"
              />
              <h4 className="artist-title">{song.artist}</h4>
            </div>
          ))}
        </div>

        <h2>Top Tracks</h2>
        <div className="showcase-grid">
          {songs.map((song) => (
            <div className="showcase-card" key={song.id}>
              <img
                src={song.image_url}
                alt={song.title}
                className="showcase-cover"
              />
              <h4 className="showcase-title">{song.title}</h4>
              <p className="showcase-artist">{song.artist}</p>
            </div>
          ))}
        </div>

        <h2>Top Albums</h2>
        <div className="showcase-grid">
          {songs.map((song) => (
            <div className="showcase-card" key={song.id}>
              <img
                src={song.image_url}
                alt={song.title}
                className="showcase-cover"
              />
              <h4 className="showcase-title">{song.album}</h4>
              <p className="showcase-artist">{song.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Startpage;
