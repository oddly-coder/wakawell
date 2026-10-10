import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { APIProvider } from "@vis.gl/react-google-maps";
import App from "./App.jsx";
import { GOOGLE_MAPS_API_KEY } from "./config";
import "./index.css";

function MissingKey() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="max-w-md rounded-md border border-slate-300 bg-white p-6 text-sm text-slate-700">
        <h1 className="mb-2 text-lg font-semibold text-slate-900">Add your Google Maps key</h1>
        <p>
          Copy <code>.env.example</code> to <code>.env</code>, set{" "}
          <code>VITE_GOOGLE_MAPS_API_KEY</code>, then restart <code>npm run dev</code>.
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {GOOGLE_MAPS_API_KEY ? (
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <App />
      </APIProvider>
    ) : (
      <MissingKey />
    )}
  </StrictMode>
);
