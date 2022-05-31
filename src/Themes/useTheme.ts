import { useEffect, useState } from "react";

const DARK_MODE = "dark-mode";

export const getDarkMode = (): boolean => JSON.parse(localStorage.getItem(DARK_MODE)!) || false;

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(getDarkMode);

  useEffect(() => {
    const initialValue = getDarkMode();
    if (initialValue !== darkMode) {
      localStorage.setItem(DARK_MODE, darkMode + '');
      window.location.reload();
    }
  }, [darkMode]);

  return [darkMode, setDarkMode];
};