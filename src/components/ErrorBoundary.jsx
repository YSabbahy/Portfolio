import { Component } from "react";

/**
 * Catches render-time errors anywhere below it in the tree and shows a
 * calm, on-brand fallback instead of a blank white screen. Errors thrown
 * inside event handlers or async code are NOT caught by React error
 * boundaries by design — only errors thrown during rendering are.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Swap for real error-reporting (Sentry, LogRocket, etc.) in production.
    console.error("Uncaught render error:", error, info?.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role="alert"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "24px",
          textAlign: "center",
          background: "#030303",
          color: "#f4f4f5",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <p
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: "1.5rem",
          }}
        >
          Something went wrong.
        </p>
        <p style={{ color: "#8b8b93", maxWidth: "380px", fontSize: "0.9rem" }}>
          Please refresh the page. If the problem continues, reach out via the contact info on my{" "}
          <a href="https://github.com/YSabbahy" style={{ color: "#ff2e2e" }}>
            GitHub
          </a>
          .
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          style={{
            background: "#dc2626",
            color: "#fff",
            border: "none",
            borderRadius: "9999px",
            padding: "10px 24px",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reload page
        </button>
      </div>
    );
  }
}
