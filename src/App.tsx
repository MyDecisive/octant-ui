import { FlowContainer } from "@components/FlowContainer";
import { FlowLayout } from "@components/layout/FlowLayout";
import { Route, Router, Switch } from "wouter";
import { Splash } from "./components/Splash";
import { ROUTES } from "./constants/ROUTES";
import { ClarityPage } from "./pages/Clarity/Clarity";
import { ConnectionsPage } from "./pages/Connections";
import { SmarthubPage } from "./pages/Smarthub";

const flowRoutes = new RegExp(/^\/(?:install)?$/);

const pageRoutes = new RegExp(/^\/(clarity|system-health|smarthub|support)$/);

function App() {
  return (
    <Router base={import.meta.env.BASE_URL}>
      <Switch>
        <Route path={flowRoutes}>
          <FlowLayout>
            <Route path={ROUTES.SPLASH} component={Splash} />
            <Route path={ROUTES.INSTALL} component={FlowContainer} />
          </FlowLayout>
        </Route>
        <Route path={pageRoutes}>
          <Switch>
            <Route path={ROUTES.CLARITY} component={ClarityPage} />
            <Route path={ROUTES.SYSTEMHEALTH} component={ConnectionsPage} />
            <Route path={ROUTES.SETTINGS} component={SmarthubPage} />
            <Route path={ROUTES.SUPPORT} component={SmarthubPage} />
          </Switch>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
