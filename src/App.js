import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Tabs, Tab, Box, AppBar } from "@mui/material";
import Calculadora from "./components/Calculadora";
import ListarLotes from "./components/ListarLotes";
import ThemeToggle from "./components/ThemeToggle";
import CalculateIcon from "@mui/icons-material/Calculate";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TableChartIcon from "@mui/icons-material/TableChart";
import TarjetasHelper from "./components/TarjetasHelper";
import CreditCardIcon from '@mui/icons-material/CreditCard';

function App() {
  // Load the saved tab from localStorage or default to 0
  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem('lastSelectedTab');
    return savedTab ? parseInt(savedTab, 10) : 0;
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  // Effect to save darkMode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    components: {
      MuiTab: {
        styleOverrides: {
          root: {
            minWidth: "45px",
            padding: "6px",
          },
        },
      },
    },
  });

  const handleTabChange = (event, newValue) => {
    if (newValue < 3) {
      // Only change the tab if it's not the theme toggle button
      setTabValue(newValue);
      // Save the selected tab to localStorage
      localStorage.setItem('lastSelectedTab', newValue.toString());
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar position="fixed" color="default" elevation={0}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab icon={<CalculateIcon />} aria-label="Calculadora" />
            <Tab icon={<CreditCardIcon />} aria-label="Lotes" />
            <Tab icon={<TableChartIcon />} aria-label="Listar" />
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </Tabs>
        </AppBar>
        <Box sx={{ flexGrow: 1, mt: "48px", overflow: "auto" }}>
          {tabValue === 0 && <Calculadora />}
          {tabValue === 1 && <TarjetasHelper />}
          {tabValue === 2 && <ListarLotes />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
