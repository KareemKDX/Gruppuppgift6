import "./App.css";
import "./css/globals.css";
import Navbar from "./components/Navbar.tsx";
import Sidebar from "./components/Sidebar.tsx";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Sidebar />

      <div className="main">main</div>
    </div>
  );
}

export default App;
