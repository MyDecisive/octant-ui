import { FlowContainer } from "@components/FlowContainer";
import { FlowLayout } from "@components/layout/FlowLayout";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { Splash } from "./components/Splash";
import { theme } from "./styles/theme";

function App() {
  const [splash, setSplash] = useState(true);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FlowLayout>
        {splash ? (
          <Splash onClickProgress={() => setSplash(false)} />
        ) : (
          <FlowContainer />
        )}
      </FlowLayout>
    </ThemeProvider>
  );
}

export default App;
