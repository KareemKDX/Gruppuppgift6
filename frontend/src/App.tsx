import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import "./css/globals.css";
import Navbar from "./components/Navbar.tsx";
import Sidebar from "./components/Sidebar.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import { API_URL, clearToken, getToken } from "./auth";
import type { User } from "./auth";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => getToken() !== null);

  useEffect(() => {
    if (!getToken()) {
      return;
    }

    axios
      .get<{ user: User }>(`${API_URL}/auth/me`)
      .then((response) => setUser(response.data.user))
      .catch((error) => {
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        if (status === 401 || status === 403 || status === 404) {
          clearToken();
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await axios.post(`${API_URL}/auth/logout`).catch(() => {});
    clearToken();
    setUser(null);
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return <AuthPage onLoggedIn={setUser} />;
  }

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <Sidebar />

      <div className="main">main</div>
    </div>
  );
}

export default App;
