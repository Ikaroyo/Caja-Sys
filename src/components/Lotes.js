import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import cajeros from "../utils/cajeros"; // Importamos la lista de cajeros

function Lotes() {
  const obtenerFechaActual = () => {
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset()); // Ajustar zona horaria
    return hoy.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    fecha: obtenerFechaActual(),
    cajero: localStorage.getItem("cajeroSeleccionado") || "",
    nroLote: "",
    osm: "",
    municipalidad: "",
    credito: "",
    debito: "",
    cheques: "",
    otros: "",
    efectivoOSM: "",
    comentarios: "",
  });

  const [openConfirm, setOpenConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    calcularEfectivoOSM();
  }, [
    formData.osm,
    formData.credito,
    formData.debito,
    formData.cheques,
    formData.otros,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Limpiar el error cuando el usuario empieza a escribir
    if (name === "nroLote") {
      setErrors((prev) => ({ ...prev, nroLote: "" }));
    }

    if (name === "cajero") {
      localStorage.setItem("cajeroSeleccionado", value);
    }
  };

  const calcularEfectivoOSM = () => {
    const { osm, credito, debito, cheques, otros } = formData;
    const efectivo =
      parseFloat(osm || 0) -
      parseFloat(credito || 0) -
      parseFloat(debito || 0) -
      parseFloat(cheques || 0) -
      parseFloat(otros || 0);
    setFormData((prevState) => ({
      ...prevState,
      efectivoOSM: isNaN(efectivo) ? "" : efectivo.toFixed(2),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación del Nro. Lote
    if (!formData.nroLote.trim()) {
      setErrors((prev) => ({
        ...prev,
        nroLote: "El Nro. Lote no puede estar vacío",
      }));
      return;
    }

    setErrors({}); // Limpiar errores si la validación pasa
    setOpenConfirm(true);
  };

  const confirmarEnvio = async () => {
    setOpenConfirm(false);
    try {
      const response = await fetch("http://localhost:3001/api/lotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setNotification({
          open: true,
          message: "Lote agregado con éxito",
          severity: "success",
        });
        // Limpiar el formulario o realizar otras acciones necesarias
        setFormData({
          fecha: obtenerFechaActual(),
          cajero: localStorage.getItem("cajeroSeleccionado") || "",
          nroLote: "",
          osm: "",
          municipalidad: "",
          credito: "",
          debito: "",
          cheques: "",
          otros: "",
          efectivoOSM: "",
          comentarios: "",
        });
      } else {
        setNotification({
          open: true,
          message: "Error al agregar el lote",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setNotification({
        open: true,
        message: "Error al enviar los datos",
        severity: "error",
      });
    }
  };

  const fieldLabels = {
    fecha: "Fecha",
    cajero: "Cajero",
    nroLote: "Nro. Lote",
    osm: "OSM",
    municipalidad: "Municipalidad",
    credito: "Crédito",
    debito: "Débito",
    cheques: "Cheques",
    otros: "Otros",
    efectivoOSM: "Efectivo OSM",
    comentarios: "Comentarios",
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="fecha"
            label="Fecha"
            type="date"
            value={formData.fecha}
            onChange={handleChange}
            fullWidth
            margin="dense"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="dense" size="small">
            <InputLabel id="cajero-label">Cajero</InputLabel>
            <Select
              labelId="cajero-label"
              name="cajero"
              value={formData.cajero}
              onChange={handleChange}
              label="Cajero"
              required
            >
              {cajeros.map((cajero) => (
                <MenuItem key={cajero.value} value={cajero.value}>
                  {cajero.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="nroLote"
            label="Nro Lote"
            value={formData.nroLote}
            onChange={handleChange}
            fullWidth
            margin="dense"
            size="small"
            error={!!errors.nroLote}
            helperText={errors.nroLote}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="osm"
            label="OSM"
            type="number"
            value={formData.osm}
            onChange={handleChange}
            fullWidth
            margin="dense"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="municipalidad"
            label="Municipalidad"
            value={formData.municipalidad}
            onChange={handleChange}
            fullWidth
            margin="dense"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="credito"
            label="Crédito"
            type="number"
            value={formData.credito}
            onChange={handleChange}
            fullWidth
            margin="dense"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="debito"
            label="Débito"
            type="number"
            value={formData.debito}
            onChange={handleChange}
            fullWidth
            margin="dense"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="cheques"
            label="Cheques"
            type="number"
            value={formData.cheques}
            onChange={handleChange}
            fullWidth
            margin="dense"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="otros"
            label="Otros"
            type="number"
            value={formData.otros}
            onChange={handleChange}
            fullWidth
            margin="dense"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="efectivoOSM"
            label="Efectivo OSM"
            type="number"
            value={formData.efectivoOSM}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="dense"
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="comentarios"
            label="Comentarios"
            value={formData.comentarios}
            onChange={handleChange}
            fullWidth
            margin="dense"
            size="small"
            multiline
            rows={1}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Button type="submit" variant="contained">
          Agregar Lote
        </Button>
      </Box>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Confirmar datos del lote</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableBody>
                {Object.entries(formData).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "bold" }}
                    >
                      {fieldLabels[key]}
                    </TableCell>
                    <TableCell align="right">
                      {key === "fecha"
                        ? new Date(value).toLocaleDateString()
                        : value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmarEnvio} variant="contained" color="primary">
            Confirmar y Enviar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Lotes;
