import { ThemeProvider } from "@emotion/react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { theme } from "./theme/pallet";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/auth";
import { ToastProvider } from "./context/toast";
import { ConfirmProvider } from "./context/confirm";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Opposer</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <ToastProvider>
            <ConfirmProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ConfirmProvider>
          </ToastProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
