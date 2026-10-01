import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import api from "../lib/api";
import "../css/HomePage.css";
import "../css/PlaylistPage.css";

type Page = {
  title: string;
  content?: string;
};

function ContentPage() {
  const { id } = useParams();
  const [page, setPage] = useState<Page | null>(null);
  const [message, setMessage] = useState("");
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    api.get(`/api/content-pages/${id}`).then((res) => {
      setPage(res.data);
      setMessage("");
      setLocked(false);
    }).catch((err) => {
      const res = axios.isAxiosError(err) ? err.response : undefined;
      setPage(res?.data?.title ? { title: res.data.title } : null);
      setMessage(res?.data?.error ?? "Could not load page");
      setLocked(res?.status === 403);
    });
  }, [id]);

  return (
    <div className="homepage-layout">
      <div className="homepage-menu-left">
        <div className="home-header">
          <div className="home-header-info">
            <h1 className="home-header-title">{page?.title}</h1>
          </div>
        </div>

        {message && (
          <div className="playlist-message">
            <p>{message}</p>
            {locked && (
              <Link to="/subscription" className="upgrade-btn">
                Upgrade
              </Link>
            )}
          </div>
        )}

        {page?.content && <p className="playlist-empty" style={{ whiteSpace: "pre-wrap" }}>{page.content}</p>}
      </div>
    </div>
  );
}

export default ContentPage;
