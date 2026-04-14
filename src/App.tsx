import { FlowContainer } from "@components/FlowContainer";
import { Layout } from "@components/layout/Layout";
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
      <Layout>
        {splash ? (
          <Splash onClickProgress={() => setSplash(false)} />
        ) : (
          <FlowContainer />
        )}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
