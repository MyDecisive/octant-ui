import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Forms } from "./components/Forms/Forms";
import { Header } from "./components/Header";
import { theme } from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Forms />
    </ThemeProvider>
  );
}

export default App;
