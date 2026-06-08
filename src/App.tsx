import { FullscreenLoader } from "@components/FullscreenLoader";
import { FlowLayout } from "@components/layout/FlowLayout";
import { StepperNav } from "@components/StepperNav";
import { useInitOctant } from "@utils/initialization/useInitOctant";
import { Redirect, Route, Switch } from "wouter";
import { Splash } from "./components/Splash";
import {
  FLOW_ROUTES,
  INSTALL_AND_CONNECT,
  PAGE_ROUTES,
  ROUTES,
} from "./constants/routing";
import { ClarityProvider } from "./contexts/Clarity.Provider";
import { InstallAndConnectProvider } from "./contexts/InstallAndConnect.Provider";
import { ClarityPage } from "./pages/Clarity/Clarity";
import { Settings } from "./pages/Settings/Settings";
import { SettingsUpdateToasts } from "./pages/Settings/SettingsUpdateToasts";
import { SystemHealthPage } from "./pages/SystemHealth/SystemHealth";

function App() {
  const resolving = useInitOctant();

  if (resolving) {
    return <FullscreenLoader />;
  }

  return (
    <>
      <Switch>
        <Route path={FLOW_ROUTES}>
          <InstallAndConnectProvider>
            <FlowLayout>
              <Route path={ROUTES.SPLASH} component={Splash} />
              <Route path={ROUTES.INSTALL_STEP} component={StepperNav} />
              {INSTALL_AND_CONNECT.map(({ Component, path }, index) => {
                return (
                  <Route
                    key={`flow-step-${index.toLocaleString()}`}
                    path={path}
                    component={Component}
                  />
                );
              })}
              <Route path={ROUTES.INSTALL}>
                <Redirect to="/install/1" />
              </Route>
            </FlowLayout>
          </InstallAndConnectProvider>
        </Route>
        <Route path={PAGE_ROUTES}>
          <Switch>
            <Route path={ROUTES.CLARITY}>
              <ClarityProvider>
                <ClarityPage />
              </ClarityProvider>
            </Route>
            <Route path={ROUTES.SYSTEMHEALTH} component={SystemHealthPage} />
            <Route path={ROUTES.SETTINGS} component={Settings} />
            {/* <Route path={ROUTES.SUPPORT} component={SmarthubPage} /> */}
          </Switch>
        </Route>
      </Switch>
      <SettingsUpdateToasts />
    </>
  );
}

export default App;
