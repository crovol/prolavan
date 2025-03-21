const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Permite solicitudes desde el front-end

// Ruta al archivo de credenciales descargado desde Google Cloud Console
const CREDENTIALS_PATH = './credentials.json'; // Asegúrate de que este archivo esté en la raíz del proyecto
const SPREADSHEET_ID = '1eLFP-TlHwdUuvTlLMxE7xEmWQ9d-mVYWKORF2jvL_18'; // Reemplaza con el ID de tu Google Sheets

// Autenticación con la API de Google
const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

// Función para agregar un pedido a Google Sheets
async function agregarPedido(pedido) {
    const sheets = google.sheets({ version: 'v4', auth });
    const values = [[pedido.id, pedido.nombre, pedido.telefono, pedido.producto, pedido.estado]];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Pedidos!A:E',
            valueInputOption: 'USER_ENTERED',
            resource: { values }
        });
    } catch (error) {
        console.error('Error al agregar el pedido:', error);
    }
}

// Función para obtener todos los pedidos desde Google Sheets
async function obtenerPedidos() {
    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Pedidos!A:E'
        });

        const rows = res.data.values;
        if (!rows || rows.length === 0) {
            return [];
        }

        // Convierte las filas en objetos
        const pedidos = rows.slice(1).map(row => ({
            id: row[0],
            nombre: row[1],
            telefono: row[2],
            producto: row[3],
            estado: row[4]
        }));
        return pedidos;
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        return [];
    }
}

// Endpoint para obtener todos los pedidos
app.get('/pedidos', async (req, res) => {
    const pedidos = await obtenerPedidos();
    res.json(pedidos);
});

// Endpoint para agregar un nuevo pedido
app.post('/pedidos', async (req, res) => {
    const pedido = req.body;
    await agregarPedido(pedido);
    res.send('Pedido agregado con éxito');
});

// Inicia el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

