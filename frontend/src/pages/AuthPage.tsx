import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, setToken } from "../auth";
import type { User } from "../auth";
import "../css/AuthPage.css";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  onLoggedIn: (user: User) => void;
};

function AuthPage({ onLoggedIn }: Props) {
  const location = useLocation();

  // adressen avgör om formuläret öppnas för inloggning eller nytt konto
  const [mode, setMode] = useState<"login" | "register">(
    location.pathname === "/register" ? "register" : "login",
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // sidan byggs inte om när man går mellan login och register så vi ställer om läget här
  useEffect(() => {
    setMode(location.pathname === "/register" ? "register" : "login");
    setError("");
  }, [location.pathname]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const body =
      mode === "login"
        ? { email: email, password: password }
        : { username: username, email: email, password: password };

    try {
      const response = await axios.post<{ token: string; user: User }>(
        `${API_URL}/auth/${mode}`,
        body,
      );
      setToken(response.data.token);
      onLoggedIn(response.data.user);
      navigate("/");
    } catch (error) {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === 400) {
        setError("Fyll i alla fält");
      } else if (status === 401) {
        setError("Fel email eller lösenord");
      } else if (status === 409) {
        setError("Emailen är redan använd");
      } else {
        setError(
          mode === "login" ? "Kunde inte logga in" : "Kunde inte skapa konto",
        );
      }
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>MusicPlate</h1>

        <h2>{mode === "login" ? "Logga in" : "Skapa konto"}</h2>

        {mode === "register" && (
          <input
            placeholder="Användarnamn"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Lösenord"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">
          {mode === "login" ? "Logga in" : "Skapa konto"}
        </button>

        {error && <p className="auth-error">{error}</p>}

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login"
            ? "Har du inget konto? Registrera dig"
            : "Har du redan ett konto? Logga in"}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;