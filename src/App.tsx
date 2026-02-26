import "./styles/app.css";
import { Header } from "./components/Header";
import { Wizard } from "./components/Wizard";
import { NavProvider } from "./context/Provider";

function App() {
  return (
    <div className="app-shell">
      <NavProvider>
        <Header />
        <Wizard />
      </NavProvider>
    </div>
  );
}

export default App;
