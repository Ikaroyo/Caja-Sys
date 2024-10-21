import React, { useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Tabs, Tab, Box, AppBar } from "@mui/material";
import Calculadora from "./components/Calculadora";
import Lotes from "./components/Lotes";
import ListarLotes from "./components/ListarLotes";
import ThemeToggle from "./components/ThemeToggle";
import CalculateIcon from "@mui/icons-material/Calculate";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TableChartIcon from "@mui/icons-material/TableChart";

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

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
      // Solo cambia el tab si no es el botón de tema
      setTabValue(newValue);
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
            <Tab icon={<ListAltIcon />} aria-label="Lotes" />
            <Tab icon={<TableChartIcon />} aria-label="Listar" />
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </Tabs>
        </AppBar>
        <Box sx={{ flexGrow: 1, mt: "48px", overflow: "auto" }}>
          {tabValue === 0 && <Calculadora />}
          {tabValue === 1 && <Lotes />}
          {tabValue === 2 && <ListarLotes />}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
