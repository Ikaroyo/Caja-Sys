import React from "react";
import { Tab } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <Tab
      icon={darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Cambiar tema"
    />
  );
}

export default ThemeToggle;
