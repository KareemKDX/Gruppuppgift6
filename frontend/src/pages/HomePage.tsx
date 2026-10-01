import { useState, useEffect } from "react";
import api from "../lib/api";
import { type Song } from "../types/song";
import SongsView from "../components/SongsView";

function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [userHasEarlyAccess, setUserHasEarlyAccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [songsRes, profileRes] = await Promise.all([
          api.get("/api/songs"),
          api.get("/api/profile"),
        ]);
        setSongs(songsRes.data);
        setUserHasEarlyAccess(profileRes.data.user.early_access === true);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p className="showcase-loading">Loading tracks...</p>;
  }

  return (
    <SongsView
      label="HOME"
      title="MINA LÅTAR"
      songs={songs}
      userHasEarlyAccess={userHasEarlyAccess}
    />
  );
}

export default HomePage;
