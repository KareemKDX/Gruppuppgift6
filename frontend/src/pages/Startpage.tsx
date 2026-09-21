import "../css/Startpage.css";
import { type Song } from "../types/song";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Startpage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const res = await fetch("http://localhost:4001/api/songs");
        const data = await res.json();
        setSongs(data.slice(0, 3));
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
      <div className="showcase-grid">
        {songs.map((song) => (
          <div className="showcase-card" key={song.id}>
            <div className="showcase-cover"></div>
            <h4 className="showcase-title">{song.title}</h4>
            <p className="showcase-artist">{song.artist}</p>
          </div>
        ))}
      </div>
      <p className="showcase-header">Explore more</p>
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
  );
}
export default Startpage;
