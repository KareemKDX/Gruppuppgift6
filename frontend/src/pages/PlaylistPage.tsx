import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api";
import { type Song } from "../types/song";
import SongsView from "../components/SongsView";

type Playlist = {
  id: number;
  name: string;
  songs: Song[];
};

function PlaylistViewPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [userHasEarlyAccess, setUserHasEarlyAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/api/playlists/${id}`), api.get("/api/profile")])
      .then(([playlistRes, profileRes]) => {
        setPlaylist(playlistRes.data.playlist);
        setUserHasEarlyAccess(profileRes.data.user.early_access === true);
      })
      .catch((err) => {
        console.log(err);
        setPlaylist(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="showcase-loading">Loading playlist...</p>;
  }

  if (!playlist) {
    return <p className="playlist-message">Playlist not found.</p>;
  }

  return (
    <SongsView
      key={playlist.id}
      label="Playlist"
      title={playlist.name}
      meta={`${playlist.songs.length} tracks`}
      songs={playlist.songs}
      userHasEarlyAccess={userHasEarlyAccess}
      headerActions={
        <Link
          to={`/playlists/${playlist.id}/edit`}
          className="btn edit-playlist-button"
        >
          EDIT PLAYLIST
        </Link>
      }
    />
  );
}

export default PlaylistViewPage;
