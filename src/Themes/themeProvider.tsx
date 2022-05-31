import React, { lazy, Suspense, ReactNode } from "react";
import { useTheme } from "./useTheme";

const DarkTheme = lazy(() => import("./DarkTheme/DarkTheme"));
const LightTheme = lazy(() => import("./LightTheme/LightTheme"));

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode] = useTheme();

  return (
    <>
      <Suspense fallback={<span />}>
        {darkMode ? <DarkTheme /> : <LightTheme />}
      </Suspense>
      { children }
    </>
  );
};