import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Forms } from "./components/Forms/Forms";
import { Header } from "./components/Header";
import { AppStateProvider, NavProvider } from "./context/Provider";
import { theme } from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppStateProvider>
        <NavProvider>
          <Header />
          <Forms />
        </NavProvider>
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;
