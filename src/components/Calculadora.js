import React, { useState, useEffect } from "react";
import { TextField, Box, Typography, IconButton, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ClearAllIcon from "@mui/icons-material/Delete";

function Calculadora() {
  const [celdas, setCeldas] = useState(Array(8).fill(""));
  const [subtotales, setSubtotales] = useState(Array(8).fill(0));
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calcularTotales();
  }, [celdas]);

  const handleCeldaChange = (index, value) => {
    const nuevasCeldas = [...celdas];
    nuevasCeldas[index] = value;
    setCeldas(nuevasCeldas);
  };

  const calcularTotales = () => {
    const nuevosSubtotales = celdas.map((celda) => {
      try {
        return eval(celda) || 0;
      } catch (error) {
        return 0;
      }
    });
    setSubtotales(nuevosSubtotales);
    setTotal(nuevosSubtotales.reduce((a, b) => a + b, 0));
  };

  const agregarCelda = () => {
    setCeldas([...celdas, ""]);
    setSubtotales([...subtotales, 0]);
  };

  const quitarCelda = () => {
    if (celdas.length > 1) {
      setCeldas(celdas.slice(0, -1));
      setSubtotales(subtotales.slice(0, -1));
    }
  };

  const limpiarTodo = () => {
    setCeldas(Array(8).fill(""));
    setSubtotales(Array(8).fill(0));
    setTotal(0);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={1} alignItems="center">
        {celdas.map((celda, index) => (
          <React.Fragment key={index}>
            <Grid item xs={8}>
              <TextField
                label={`Celda ${index + 1}`}
                value={celda}
                onChange={(e) => handleCeldaChange(index, e.target.value)}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" fontWeight="bold">
                = {subtotales[index]}
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", mb: 2 }}>
        <IconButton onClick={agregarCelda} color="primary" size="small">
          <AddIcon />
        </IconButton>
        <IconButton onClick={quitarCelda} color="secondary" size="small">
          <RemoveIcon />
        </IconButton>
        <IconButton onClick={limpiarTodo} color="error" size="small">
          <ClearAllIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          Total: {total}
        </Typography>
      </Box>
    </Box>
  );
}

export default Calculadora;
