import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

const BASE_URL = "http://localhost:3001"; // Asegúrate de que este es el puerto correcto

function ListarLotes() {
  const [lotes, setLotes] = useState([]);
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    cajero: "",
  });
  const [totalEfectivoOSM, setTotalEfectivoOSM] = useState(0);
  const [editingLote, setEditingLote] = useState(null);
  const [originalLote, setOriginalLote] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loteToDelete, setLoteToDelete] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [editedFields, setEditedFields] = useState({});

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchLotes();
  }, []);

  const fetchLotes = async () => {
    try {
      const queryParams = new URLSearchParams(filtros).toString();
      const response = await fetch(
        `http://localhost:3001/api/lotes?${queryParams}`
      );
      if (response.ok) {
        const data = await response.json();
        setLotes(data);
        calcularTotalEfectivoOSM(data);
      } else {
        console.error("Error al obtener los lotes");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const calcularTotalEfectivoOSM = (lotesData) => {
    const total = lotesData.reduce(
      (sum, lote) => sum + parseFloat(lote.efectivoOSM || 0),
      0
    );
    setTotalEfectivoOSM(total);
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const aplicarFiltros = () => {
    fetchLotes();
  };

  const handleEditClick = (lote) => {
    setEditingLote({ ...lote });
    setOriginalLote({ ...lote });
    setEditedFields({});
    setOpenEditDialog(true);
    setIsEdited(false);
  };

  const calcularEfectivoOSM = (lote) => {
    const osm = parseFloat(lote.osm) || 0;
    const credito = parseFloat(lote.credito) || 0;
    const debito = parseFloat(lote.debito) || 0;
    const cheques = parseFloat(lote.cheques) || 0;
    const otros = parseFloat(lote.otros) || 0;
    return (osm - credito - debito - cheques - otros).toFixed(2);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingLote((prevState) => {
      const newState = {
        ...prevState,
        [name]: value,
      };
      // Recalcular efectivoOSM
      newState.efectivoOSM = calcularEfectivoOSM(newState);

      // Actualizar campos editados
      setEditedFields((prev) => ({
        ...prev,
        [name]: value !== originalLote[name],
      }));

      setIsEdited(JSON.stringify(newState) !== JSON.stringify(originalLote));
      return newState;
    });
  };

  const handleEditSubmit = () => {
    if (isEdited) {
      setOpenConfirmDialog(true);
    }
  };

  const confirmUpdate = async () => {
    setOpenConfirmDialog(false);
    try {
      const response = await fetch(
        `http://localhost:3001/api/lotes/${editingLote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingLote),
        }
      );
      if (response.ok) {
        setOpenEditDialog(false);
        fetchLotes();
      } else {
        alert("Error al actualizar el lote");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar los datos");
    }
  };

  const handleDeleteClick = (lote) => {
    setLoteToDelete(lote);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/lotes/${loteToDelete.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setOpenDeleteDialog(false);
        fetchLotes();
      } else {
        alert("Error al eliminar el lote");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar el lote");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        {" "}
        {/* Aumentado el margen inferior */}
        <Box sx={{ display: "flex", mb: 2 }}>
          {" "}
          {/* Aumentado el margen inferior */}
          <TextField
            name="fechaInicio"
            label="Fecha Inicio"
            type="date"
            value={filtros.fechaInicio}
            onChange={handleFiltroChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mr: 1, flex: 1 }}
            size="small"
            inputProps={{
              style: { fontSize: "0.875rem", padding: "8px" },
            }}
          />
          <TextField
            name="fechaFin"
            label="Fecha Fin"
            type="date"
            value={filtros.fechaFin}
            onChange={handleFiltroChange}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1 }}
            size="small"
            inputProps={{
              style: { fontSize: "0.875rem", padding: "8px" },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControl sx={{ minWidth: 120, mr: 1 }} size="small">
            <InputLabel id="cajero-filter-label">Cajero</InputLabel>
            <Select
              labelId="cajero-filter-label"
              name="cajero"
              value={filtros.cajero}
              onChange={handleFiltroChange}
              label="Cajero"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Carina">Carina</MenuItem>
              <MenuItem value="Franco">Franco</MenuItem>
              <MenuItem value="Silvio">Silvio</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={aplicarFiltros} color="primary" size="small">
            <FilterListIcon />
          </IconButton>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Cajero</TableCell>
              {!isSmallScreen && <TableCell>Nro Lote</TableCell>}
              {!isSmallScreen && <TableCell>OSM</TableCell>}
              <TableCell>Efectivo OSM</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lotes.map((lote) => (
              <TableRow key={lote.id}>
                <TableCell>
                  {new Date(lote.fecha).toLocaleDateString()}
                </TableCell>
                <TableCell>{lote.cajero}</TableCell>
                {!isSmallScreen && <TableCell>{lote.nroLote}</TableCell>}
                {!isSmallScreen && <TableCell>{lote.osm}</TableCell>}
                <TableCell>{lote.efectivoOSM}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(lote)}
                    color="primary"
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(lote)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Total Efectivo OSM: {totalEfectivoOSM.toFixed(2)}
      </Typography>

      {/* Diálogo de Edición */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Editar Lote</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {editingLote &&
              Object.entries(editingLote).map(([key, value]) => {
                if (key === "id") return null;
                return (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <TextField
                      fullWidth
                      name={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={value}
                      onChange={handleEditChange}
                      margin="dense"
                      size="small"
                      InputProps={{
                        readOnly: key === "efectivoOSM",
                      }}
                      sx={{
                        my: 0.5,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: editedFields[key]
                              ? "green"
                              : "inherit",
                          },
                        },
                      }}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={!isEdited}
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmación de Actualización */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirmar Actualización</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea actualizar este lote?
          </Typography>
          {editingLote && (
            <Box sx={{ mt: 2 }}>
              {Object.entries(editingLote).map(
                ([key, value]) =>
                  key !== "id" && (
                    <Typography key={key}>
                      <strong>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </strong>{" "}
                      {value}
                    </Typography>
                  )
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>
          <Button onClick={confirmUpdate} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Está seguro de que desea eliminar este lote?</Typography>
          {loteToDelete && (
            <Box sx={{ mt: 2 }}>
              {Object.entries(loteToDelete).map(
                ([key, value]) =>
                  key !== "id" && (
                    <Typography key={key}>
                      <strong>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </strong>{" "}
                      {value}
                    </Typography>
                  )
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ListarLotes;
