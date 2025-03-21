const express = require('express');
const xlsx = require('xlsx');
const fs = require('fs');
const cors = require('cors'); // Importa el módulo cors

const app = express();
app.use(express.json());
app.use(cors()); // Habilita CORS para permitir solicitudes desde el front-end

const excelPath = './pedidos.xlsx'; // Ruta al archivo Excel

// Verifica si el archivo Excel existe; si no, lo crea con columnas iniciales
if (!fs.existsSync(excelPath)) {
    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet([]);
    xlsx.utils.book_append_sheet(workbook, sheet, 'Pedidos');
    xlsx.writeFile(workbook, excelPath);
}

// Función para leer los datos de la planilla
function leerPedidos() {
    try {
        const workbook = xlsx.readFile(excelPath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        return xlsx.utils.sheet_to_json(sheet);
    } catch (error) {
        console.error('Error al leer el archivo Excel:', error);
        return [];
    }
}

// Función para escribir datos en la planilla
function escribirPedidos(pedidos) {
    try {
        const workbook = xlsx.utils.book_new();
        const sheet = xlsx.utils.json_to_sheet(pedidos);
        xlsx.utils.book_append_sheet(workbook, sheet, 'Pedidos');
        xlsx.writeFile(workbook, excelPath);
    } catch (error) {
        console.error('Error al escribir en el archivo Excel:', error);
    }
}

// Endpoint para obtener todos los pedidos
app.get('/pedidos', (req, res) => {
    try {
        const pedidos = leerPedidos();
        res.json(pedidos);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).send('Error al obtener los pedidos.');
    }
});

// Endpoint para agregar un nuevo pedido
app.post('/pedidos', (req, res) => {
    try {
        console.log('Datos recibidos:', req.body); // Verifica qué datos llegan al servidor
        const pedidos = leerPedidos();
        pedidos.push(req.body); // Agregar el nuevo pedido a la lista
        escribirPedidos(pedidos);
        res.send('Pedido agregado con éxito');
    } catch (error) {
        console.error('Error al agregar el pedido:', error);
        res.status(500).send('Error al agregar el pedido.');
    }
});

// Endpoint para actualizar el estado del pedido
app.patch('/pedidos', (req, res) => {
    try {
        const pedidos = leerPedidos();
        const pedido = pedidos.find(p => p.id === req.body.id); // Buscar pedido por ID
        if (pedido) {
            pedido.estado = req.body.estado; // Actualizar el estado
            escribirPedidos(pedidos);
            res.send('Estado del pedido actualizado');
        } else {
            res.status(404).send('Pedido no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar el pedido:', error);
        res.status(500).send('Error al actualizar el pedido.');
    }
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
