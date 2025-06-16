"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useMemo, useState } from "react";

function MuiThemeSyncProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = useMemo(() => {
    const isDark = resolvedTheme === "dark";

    return createTheme({
      palette: {
        mode: isDark ? "dark" : "light",
        background: {
          default: isDark ? "#020d1a" : "#f9fafb",
          paper: isDark ? "#0f172a" : "#fff",
        },
      },
      typography: {
        fontFamily: "Satoshi, sans-serif",
      },
    });
  }, [resolvedTheme]);

  if (!mounted) return null; 

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <MuiThemeSyncProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </MuiThemeSyncProvider>
    </NextThemesProvider>
  );
}
