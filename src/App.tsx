import { FlowLayout } from "@components/layout/FlowLayout";
import { StepperNav } from "@components/StepperNav";
import { Redirect, Route, Router, Switch } from "wouter";
import { Splash } from "./components/Splash";
import {
  FLOW_ROUTES,
  INSTALL_AND_CONNECT,
  PAGE_ROUTES,
  ROUTES,
} from "./constants/routing";
import { ClarityPage } from "./pages/Clarity/Clarity";
import { ConnectionsPage } from "./pages/Connections";
import { SmarthubPage } from "./pages/Smarthub";

function App() {
  return (
    <Router base={import.meta.env.BASE_URL}>
      <Switch>
        <Route path={FLOW_ROUTES}>
          <FlowLayout>
            <Route path={ROUTES.SPLASH} component={Splash} />
            <Route path={ROUTES.INSTALL_STEP} component={StepperNav} />
            {INSTALL_AND_CONNECT.map(({ Component }, index) => (
              <Route
                key={`flow-step-${index.toLocaleString()}`}
                path={`${ROUTES.INSTALL}/${(index + 1).toString()}`}
                component={Component}
              />
            ))}
            <Route path={ROUTES.INSTALL}>
              <Redirect to="/install/1" />
            </Route>
          </FlowLayout>
        </Route>
        <Route path={PAGE_ROUTES}>
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
