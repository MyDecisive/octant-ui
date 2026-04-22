import { FlowContainer } from "@components/FlowContainer";
import { FlowLayout } from "@components/layout/FlowLayout";
import { PageContainer } from "@components/layout/PageContainer";
import { Route, Switch } from "wouter";
import { Splash } from "./components/Splash";
import { ROUTES } from "./constants/ROUTES";
import { ClarityPage } from "./pages/Clarity";

const flowRoutes = new RegExp(/^\/(?:install)?$/);

function App() {
  return (
    <Switch>
      <Route path={flowRoutes}>
        <FlowLayout>
          <Route path={ROUTES.SPLASH} component={Splash} />
          <Route path={ROUTES.INSTALL} component={FlowContainer} />
        </FlowLayout>
      </Route>
      <PageContainer>
        <Switch>
          <Route path={ROUTES.CLARITY} component={ClarityPage} />
          <Route path={ROUTES.CONNECTIONS} component={FlowContainer} />
          <Route path={ROUTES.SMARTHUB} component={FlowContainer} />
        </Switch>
      </PageContainer>
    </Switch>
  );
}

export default App;
