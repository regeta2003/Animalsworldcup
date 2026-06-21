import { StrictMode, Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "@/context/data";
import App from "./App";
import "./styles.css";

// Last-resort guard: shows the error instead of a blank white screen.
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "system-ui, sans-serif", background: "#f5f5f4", color: "#1a1a1a" }}>
          <div style={{ maxWidth: 560 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Something went wrong</h1>
            <p style={{ color: "#555", marginBottom: 12 }}>Please reload the page. If it keeps happening, send this message:</p>
            <pre style={{ whiteSpace: "pre-wrap", background: "#fff", border: "1px solid #e5e5e5", borderRadius: 8, padding: 12, fontSize: 12, overflow: "auto" }}>
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <button onClick={() => location.reload()} style={{ marginTop: 14, background: "#0B8A3D", color: "#fff", border: 0, borderRadius: 8, padding: "10px 18px", fontWeight: 700, cursor: "pointer" }}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <DataProvider>
          <App />
        </DataProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
