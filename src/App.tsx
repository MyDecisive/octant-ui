import { FlowContainer } from "@components/FlowContainer";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FlowContainer />
    </ThemeProvider>
  );
}

export default App;
