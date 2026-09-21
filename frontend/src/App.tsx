import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./css/globals.css";
import Navbar from "./components/Navbar.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Startpage from "./pages/Startpage.tsx";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Sidebar />
        <div className="main">
          <Routes>
            <Route path="/" element={<Startpage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
