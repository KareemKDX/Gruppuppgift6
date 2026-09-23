import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./css/globals.css";
import Navbar from "./components/Navbar.tsx";
import Sidebar from "./components/Sidebar.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import { API_URL, clearToken, getToken } from "./auth";
import type { User } from "./auth";
import Startpage from "./pages/Startpage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import SubscriptionPage from "./pages/SubscriptionPage.tsx";

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
        const status = axios.isAxiosError(error)
          ? error.response?.status
          : undefined;
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
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />

        <Sidebar />

        <div className="main">
          {!user ? (
            <Routes>
              <Route path="/" element={<Startpage />} />
              <Route
                path="/login"
                element={<AuthPage onLoggedIn={setUser} />}
              />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/Admin" element={<AdminPage />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
