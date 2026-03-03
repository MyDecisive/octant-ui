import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Forms } from "./components/Forms";
import { Header } from "./components/Header";
import { NavProvider } from "./context/Provider";
import { theme } from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavProvider>
        <Header />
        <Forms />
      </NavProvider>
    </ThemeProvider>
  );
}

export default App;
