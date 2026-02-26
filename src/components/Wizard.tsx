import { useContext, useState } from "react";
import { navSteps, integrationOptions } from "../constants";
import { NavContext } from "../context/Context";
import { Nav } from "./Nav";
import { IntegrationSelect } from "./IntegrationSelect";

export function Wizard() {
  const { activeStep, handleSetActiveStep } = useContext(NavContext);
  const nextStep = navSteps.find((step) => step.id === activeStep.id + 1);
  const [integration, setIntegration] = useState("datadog");
  const [apiKey, setApiKey] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // Simulated connection status for the integration step
  const handleConnect = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (connectionStatus === "loading") return;
    setConnectionStatus("loading");

    const shouldSucceed = Math.random() >= 0.5;
    const delayMs = 900 + Math.round(Math.random() * 800);

    window.setTimeout(() => {
      setConnectionStatus(shouldSucceed ? "success" : "error");
    }, delayMs);
  };

  return (
    <div className="wizard">
      <Nav />
      <section className="wizard-stage">
        <div className="stage-header">
          <div>
            <h2>{activeStep.title}: MyDecisive SmartHub</h2>
            <p className="stage-subtitle">{activeStep.subtitle}</p>
          </div>
          <span className="status-pill">Status: {activeStep.status}</span>
        </div>

        <div className="stage-grid">
          {activeStep.id === 1 && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h1>Congrats! The hub is installed.</h1>
                  <h3>Now, lets gets some data flowing!</h3>
                </div>
              </div>
            </div>
          )}
          {activeStep.id === 2 && (
            <div className="card">
              <div className="card-header">
                <span className="card-step">3</span>
                <div>
                  <h3>Select your integration</h3>
                  <p>Let's turn on the facet</p>
                </div>
              </div>
              <IntegrationSelect
                value={integration}
                options={integrationOptions}
                onChange={setIntegration}
              />
            </div>
          )}
          {activeStep.id === 3 && (
            <div className="card">
              <div className="card-header">
                <span className="card-step">3</span>
                <div>
                  <h3>Enter your DataDog API Key</h3>
                </div>
              </div>
              <form className="api-key-form" onSubmit={handleConnect}>
                <label htmlFor="apiKey">DataDog API Key</label>
                <input
                  type="text"
                  id="apiKey"
                  name="apiKey"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder="dd123..."
                />
                <div className="api-key-actions">
                  <button
                    className="primary"
                    type="submit"
                    disabled={connectionStatus === "loading" || !apiKey}
                  >
                    {connectionStatus === "loading"
                      ? "Connecting..."
                      : "Connect"}
                  </button>
                  <div className="api-key-status">
                    {connectionStatus === "loading" && (
                      <span className="status-indicator">
                        <span className="spinner" aria-hidden="true" />
                        Waiting for response…
                      </span>
                    )}
                    {connectionStatus === "success" && (
                      <span className="status-indicator success">
                        Connected
                      </span>
                    )}
                    {connectionStatus === "error" && (
                      <span className="status-indicator error">
                        Error: Try again
                      </span>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="stage-footer">
          {activeStep.button && nextStep && (
            <button
              className="secondary"
              onClick={() => nextStep && handleSetActiveStep(nextStep)}
            >
              {activeStep.button}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
