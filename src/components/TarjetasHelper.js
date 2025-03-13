import React, { useState, useEffect } from "react";
import { TextField, Box, Typography, IconButton, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, Stack } from "@mui/material";
import { Grid, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Calculadora from "./Calculadora";

function TarjetasHelper() {
    const [datePrefix, setDatePrefix] = useState("");
    const [cuponCounter, setCuponCounter] = useState("");
    const [terminal, setTerminal] = useState("39274590");
    const [loteNumber, setLoteNumber] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [copiedText, setCopiedText] = useState("");
    
    // Initialize expanded states from localStorage or use defaults
    const [tarjetasExpanded, setTarjetasExpanded] = useState(() => {
        const saved = localStorage.getItem('tarjetasAccordionExpanded');
        return saved !== null ? JSON.parse(saved) : true;
    });
    
    const [calculadoraExpanded, setCalculadoraExpanded] = useState(() => {
        const saved = localStorage.getItem('calculadoraAccordionExpanded');
        return saved !== null ? JSON.parse(saved) : true;
    });

    // Load saved values from localStorage when component mounts
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const savedCuponCounter = localStorage.getItem('cuponCounter') || "0001";
        const savedTerminal = localStorage.getItem('terminal') || "39274590";
        const savedLoteInfo = JSON.parse(localStorage.getItem('loteInfo') || '{"date":"", "counter":"001"}');
        
        // Format current date for cupon number
        const year = new Date().getFullYear().toString();
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const day = new Date().getDate().toString().padStart(2, '0');
        
        setDatePrefix(`${year}${day}${month}`);
        setCuponCounter(savedCuponCounter);
        setTerminal(savedTerminal);
        
        // Reset lote counter if it's a new day
        if (savedLoteInfo.date !== today) {
            setLoteNumber("001");
            localStorage.setItem('loteInfo', JSON.stringify({date: today, counter: "001"}));
        } else {
            setLoteNumber(savedLoteInfo.counter);
        }
    }, []);

    // Save accordion states to localStorage when they change

    useEffect(() => {
        localStorage.setItem('tarjetasAccordionExpanded', JSON.stringify(tarjetasExpanded));
    }, [tarjetasExpanded]);

    useEffect(() => {
        localStorage.setItem('calculadoraAccordionExpanded', JSON.stringify(calculadoraExpanded));
    }, [calculadoraExpanded]);

    const incrementCuponCounter = () => {
        let counter = parseInt(cuponCounter, 10);
        counter = (counter + 1) % 10000;
        const newCounter = counter.toString().padStart(4, '0');
        
        setCuponCounter(newCounter);
        localStorage.setItem('cuponCounter', newCounter);
    };

    const decrementCuponCounter = () => {
        let counter = parseInt(cuponCounter, 10);
        counter = (counter - 1 + 10000) % 10000;
        const newCounter = counter.toString().padStart(4, '0');
        
        setCuponCounter(newCounter);
        localStorage.setItem('cuponCounter', newCounter);
    };

    const incrementLoteCounter = () => {
        const today = new Date().toISOString().split('T')[0];
        let counter = parseInt(loteNumber, 10);
        counter = (counter + 1) % 1000;
        const newCounter = counter.toString().padStart(3, '0');
        
        setLoteNumber(newCounter);
        localStorage.setItem('loteInfo', JSON.stringify({date: today, counter: newCounter}));
    };

    const decrementLoteCounter = () => {
        const today = new Date().toISOString().split('T')[0];
        let counter = parseInt(loteNumber, 10);
        counter = (counter - 1 + 1000) % 1000;
        const newCounter = counter.toString().padStart(3, '0');
        
        setLoteNumber(newCounter);
        localStorage.setItem('loteInfo', JSON.stringify({date: today, counter: newCounter}));
    };

    const handleTerminalChange = (event) => {
        setTerminal(event.target.value);
        localStorage.setItem('terminal', event.target.value);
    };

    const getFullCuponNumber = () => {
        return `${datePrefix}${cuponCounter}`;
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedText(label || text);
                setSnackbarOpen(true);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleTarjetasAccordionChange = (event, isExpanded) => {
        setTarjetasExpanded(isExpanded);
    };

    const handleCalculadoraAccordionChange = (event, isExpanded) => {
        setCalculadoraExpanded(isExpanded);
    };

    return (
        <Box sx={{ 
            width: '100%', 
            height: '100%',
            p: 0 
        }}>
            <Accordion 
                expanded={tarjetasExpanded} 
                onChange={handleTarjetasAccordionChange} 
                sx={{ 
                    mb: 1,
                    boxShadow: 'none',
                    '&:before': {
                        display: 'none',
                    },
                    borderRadius: 0
                }}
                disableGutters
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="tarjetas-content"
                    id="tarjetas-header"
                    sx={{ 
                        minHeight: '48px',
                        borderBottom: 1, 
                        borderColor: 'divider',
                        px: 1
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">Asistente de Tarjetas</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 1 }}>
                    {/* Combined Cupón Row */}
                    <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Grid item xs={4}>
                            <TextField
                                label="Fecha"
                                value={datePrefix}
                                InputProps={{ readOnly: true }}
                                fullWidth
                                margin="dense"
                                size="small"
                                sx={{ '& .MuiInputBase-input': { bgcolor: 'action.hover' } }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Número"
                                value={cuponCounter}
                                onChange={(e) => setCuponCounter(e.target.value)}
                                fullWidth
                                margin="dense"
                                size="small"
                                inputProps={{ maxLength: 4 }}
                            />
                        </Grid>
                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-start" }}>
                            <IconButton onClick={incrementCuponCounter} color="primary" size="small" sx={{ p: 0.5 }}>
                                <AddIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={decrementCuponCounter} color="secondary" size="small" sx={{ p: 0.5 }}>
                                <RemoveIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => copyToClipboard(getFullCuponNumber(), "Número de Cupón copiado")} color="info" size="small" sx={{ p: 0.5 }}>
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                    </Grid>

                    {/* Terminal Row */}
                    <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Grid item xs={8}>
                            <FormControl fullWidth margin="dense" size="small">
                                <InputLabel>Terminal</InputLabel>
                                <Select
                                    value={terminal}
                                    onChange={handleTerminalChange}
                                    label="Terminal"
                                >
                                    <MenuItem value="39274590">39274590</MenuItem>
                                    <MenuItem value="12345678">12345678</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-start" }}>
                            <IconButton onClick={() => copyToClipboard(terminal, "Terminal copiado")} color="info" size="small" sx={{ p: 0.5 }}>
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                    </Grid>

                    {/* Lote Number Row */}
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={8}>
                            <TextField
                                label="Número de Lote"
                                value={loteNumber}
                                onChange={(e) => setLoteNumber(e.target.value)}
                                fullWidth
                                margin="dense"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-start" }}>
                            <IconButton onClick={incrementLoteCounter} color="primary" size="small" sx={{ p: 0.5 }}>
                                <AddIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={decrementLoteCounter} color="secondary" size="small" sx={{ p: 0.5 }}>
                                <RemoveIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => copyToClipboard(loteNumber, "Número de Lote copiado")} color="info" size="small" sx={{ p: 0.5 }}>
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Accordion 
                expanded={calculadoraExpanded} 
                onChange={handleCalculadoraAccordionChange}
                sx={{ 
                    boxShadow: 'none',
                    '&:before': {
                        display: 'none',
                    },
                    borderRadius: 0
                }}
                disableGutters
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="calculadora-content"
                    id="calculadora-header"
                    sx={{ 
                        minHeight: '48px',
                        borderBottom: 1, 
                        borderColor: 'divider',
                        px: 1
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">Calculadora</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, overflow: 'auto' }}>
                    <Calculadora />
                </AccordionDetails>
            </Accordion>
            
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={1500}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    {copiedText}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default TarjetasHelper;
