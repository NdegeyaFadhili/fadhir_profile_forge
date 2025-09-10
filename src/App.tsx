import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

const App = () => {
  return React.createElement(
    HelmetProvider,
    null,
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(
        AuthProvider,
        null,
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(Toaster),
          React.createElement(Sonner),
          React.createElement(
            BrowserRouter,
            null,
            React.createElement(
              Routes,
              null,
              React.createElement(Route, { path: "/", element: React.createElement(Index) }),
              React.createElement(Route, { path: "/auth", element: React.createElement(Auth) }),
              React.createElement(Route, { path: "*", element: React.createElement(NotFound) })
            )
          )
        )
      )
    )
  );
};

export default App;
