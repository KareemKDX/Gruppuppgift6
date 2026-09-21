import { useEffect, useState } from "react";
import axios from "axios";
import "../css/AdminPage.css";

// hur en låt ser ut när den kommer från databasen
type Song = {
  id: number;
  artist: string;
  title: string;
  album: string | null;
  duration: number;
  release_type: string;
};

function AdminPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState("");

  // fälten i formuläret
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [album, setAlbum] = useState("");
  const [duration, setDuration] = useState("");
  const [releaseType, setReleaseType] = useState("released");

  // hämtar alla låtar från databasen
  const fetchSongs = async () => {
    try {
      const response = await axios.get<Song[]>("http://localhost:4001/api/songs");
      setSongs(response.data);
    } catch {
      setError("Kunde inte hämta låtar");
    }
  };

  // hämtar låtarna när sidan laddas
  useEffect(() => {
    fetchSongs();
  }, []);

  // skickar den nya låten till servern
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:4001/api/songs", {
        artist: artist,
        title: title,
        album: album || undefined,
        duration: Number(duration),
        release_type: releaseType,
      });

      // tömmer formuläret och hämtar listan på nytt
      setArtist("");
      setTitle("");
      setAlbum("");
      setDuration("");
      setReleaseType("released");
      fetchSongs();
    } catch {
      setError("Kunde inte lägga till låten");
    }
  };

  return (
    <div className="admin-page">
      <h1>Adminvy</h1>

      <h2>Lägg till låt</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          placeholder="Artist"
          value={artist}
          onChange={(event) => setArtist(event.target.value)}
        />

        <input
          placeholder="Titel"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <input
          placeholder="Album"
          value={album}
          onChange={(event) => setAlbum(event.target.value)}
        />

        <input
          placeholder="Längd i sekunder"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
        />

        <select
          value={releaseType}
          onChange={(event) => setReleaseType(event.target.value)}
        >
          <option value="released">Släppt</option>
          <option value="early_access">Early access</option>
        </select>

        <button type="submit">Spara låt</button>
      </form>

      {error && <p className="admin-error">{error}</p>}

      <h2>Låtar ({songs.length})</h2>

      <ul className="song-list">
        {songs.map((song) => (
          <li key={song.id} className="song-item">
            <span>
              <span className="song-name">{song.title}</span>
              <span className="song-artist"> — {song.artist}</span>
            </span>

            <span
              className={
                song.release_type === "early_access"
                  ? "song-badge early"
                  : "song-badge"
              }
            >
              {song.release_type === "early_access" ? "Early access" : "Släppt"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;