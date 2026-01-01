import React from "react";
import { BrowserRouter } from "react-router-dom";
import QueryProvider from "./providers/QueryProvider.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import Routes from "./routes.jsx";

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  );
}
