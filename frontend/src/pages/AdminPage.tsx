import { useEffect, useState } from "react";
import api from "../lib/api";
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

// hur en prenumerationsnivå ser ut
type Subscription = {
  id: number;
  name: string;
};

// hur en innehållssida ser ut
type ContentPage = {
  id: number;
  title: string;
  required_subscription_id: number;
};

function AdminPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [contentPages, setContentPages] = useState<ContentPage[]>([]);
  const [error, setError] = useState("");

  // fälten i låtformuläret
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [album, setAlbum] = useState("");
  const [duration, setDuration] = useState("");
  const [releaseType, setReleaseType] = useState("released");

  // fälten i formuläret för innehållssidor
  const [pageTitle, setPageTitle] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [requiredLevel, setRequiredLevel] = useState("");

  // hämtar alla låtar från databasen
  const fetchSongs = async () => {
    try {
      const response = await api.get<Song[]>("/api/songs");
      setSongs(response.data);
    } catch {
      setError("Kunde inte hämta låtar");
    }
  };

  // hämtar alla nivåer så man kan välja i formuläret
  const fetchSubscriptions = async () => {
    try {
      const response = await api.get<{ subscriptions: Subscription[] }>(
        "/api/subscriptions"
      );
      setSubscriptions(response.data.subscriptions);

      // väljer första nivån som standard
      if (response.data.subscriptions.length > 0) {
        setRequiredLevel(String(response.data.subscriptions[0].id));
      }
    } catch {
      setError("Kunde inte hämta nivåer");
    }
  };

  // hämtar alla innehållssidor från databasen
  const fetchContentPages = async () => {
    try {
      const response = await api.get<ContentPage[]>("/api/content-pages");
      setContentPages(response.data);
    } catch {
      setError("Kunde inte hämta innehållssidor");
    }
  };

  // hämtar allt när sidan laddas
  useEffect(() => {
    fetchSongs();
    fetchSubscriptions();
    fetchContentPages();
  }, []);

  // hittar namnet på en nivå utifrån id
  const getLevelName = (id: number) => {
    const subscription = subscriptions.find((item) => item.id === id);
    return subscription ? subscription.name : "Okänd";
  };

  // skickar den nya låten till servern
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/api/songs", {
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

  // byter mellan släppt och early access
  const handleToggle = async (song: Song) => {
    setError("");

    const newType = song.release_type === "early_access" ? "released" : "early_access";

    try {
      await api.patch(`/api/songs/${song.id}`, {
        release_type: newType,
      });
      fetchSongs();
    } catch {
      setError("Kunde inte ändra låten");
    }
  };

  // skickar den nya innehållssidan till servern
  const handlePageSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/api/content-pages", {
        title: pageTitle,
        content: pageContent,
        required_subscription_id: Number(requiredLevel),
      });

      // tömmer formuläret och hämtar listan på nytt
      setPageTitle("");
      setPageContent("");
      if (subscriptions.length > 0) {
        setRequiredLevel(String(subscriptions[0].id));
      }
      fetchContentPages();
    } catch {
      setError("Kunde inte lägga till innehållssidan");
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

      <h2>Lägg till innehållssida</h2>

      <form className="admin-form" onSubmit={handlePageSubmit}>
        <input
          placeholder="Rubrik"
          value={pageTitle}
          onChange={(event) => setPageTitle(event.target.value)}
        />

        <textarea
          placeholder="Innehåll"
          rows={5}
          value={pageContent}
          onChange={(event) => setPageContent(event.target.value)}
        />

        <select
          value={requiredLevel}
          onChange={(event) => setRequiredLevel(event.target.value)}
        >
          {subscriptions.map((subscription) => (
            <option key={subscription.id} value={subscription.id}>
              Kräver {subscription.name}
            </option>
          ))}
        </select>

        <button type="submit">Spara sida</button>
      </form>

      {error && <p className="admin-error">{error}</p>}

      <h2>Innehållssidor ({contentPages.length})</h2>

      <ul className="page-list">
        {contentPages.map((page) => (
          <li key={page.id} className="page-item">
            <div className="page-header">
              <span className="page-title">{page.title}</span>
              <span className="song-badge">
                Kräver {getLevelName(page.required_subscription_id)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <h2>Låtar ({songs.length})</h2>

      <ul className="song-list">
        {songs.map((song) => (
          <li key={song.id} className="song-item">
            <span>
              <span className="song-name">{song.title}</span>
              <span className="song-artist"> — {song.artist}</span>
            </span>

            <span className="song-actions">
              <span
                className={
                  song.release_type === "early_access"
                    ? "song-badge early"
                    : "song-badge"
                }
              >
                {song.release_type === "early_access" ? "Early access" : "Släppt"}
              </span>

              <button
                type="button"
                className="toggle-button"
                onClick={() => handleToggle(song)}
              >
                {song.release_type === "early_access" ? "Gör släppt" : "Gör early access"}
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;