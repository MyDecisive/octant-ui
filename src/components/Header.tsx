export function Header() {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">
          <img src="/logo.svg" alt="logo" />
        </div>
        <div className="brand-text">
          <span className="brand-title">MyDecisive InkOps</span>
          <span className="brand-subtitle">SmartHub setup wizard</span>
        </div>
      </div>
      <div className="header-meta">
        <span className="chip">Local cluster</span>
        <span className="chip chip-outline">v0.1</span>
      </div>
    </header>
  );
}
