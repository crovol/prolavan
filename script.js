const pedidos = [];

function generarID() {
    return 'PED-' + Math.floor(Math.random() * 100000);
}

// Registrar un pedido
document.getElementById('pedidoForm').onsubmit = function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const producto = document.getElementById('producto').value;

    const nuevoPedido = {
        id: generarID(),
        nombre,
        telefono,
        producto,
        estado: 'En proceso'
    };

    // Enviar datos al servidor (con Excel como almacenamiento)
    fetch('http://localhost:3000/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPedido)
    })
    .then(response => {
        if (response.ok) {
            console.log('Pedido agregado exitosamente.');
            mostrarPedidos();
        } else {
            console.error('Error al agregar el pedido:', response.statusText);
        }
    })
    .catch(error => console.error('Error:', error));
};

// Mostrar pedidos (desde Excel)
function mostrarPedidos() {
    fetch('http://localhost:3000/pedidos')
        .then(response => response.json())
        .then(pedidos => {
            const tbody = document.getElementById('pedidos').querySelector('tbody');
            tbody.innerHTML = '';
            pedidos.forEach(pedido => {
                const fila = `<tr>
                    <td>${pedido.id}</td>
                    <td>${pedido.nombre}</td>
                    <td>${pedido.telefono}</td>
                    <td>${pedido.producto}</td>
                    <td>${pedido.estado}</td>
                    <td><button onclick="actualizarEstado('${pedido.id}')">Actualizar</button></td>
                </tr>`;
                tbody.innerHTML += fila;
            });
        })
        .catch(error => console.error('Error al obtener pedidos:', error));
}

// Actualizar estado del pedido
function actualizarEstado(id) {
    const nuevoEstado = { id, estado: 'Listo para retirar' };
    fetch('http://localhost:3000/pedidos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEstado)
    })
    .then(response => {
        if (response.ok) {
            console.log('Estado del pedido actualizado.');
            mostrarPedidos();
        } else {
            console.error('Error al actualizar el pedido:', response.statusText);
        }
    })
    .catch(error => console.error('Error:', error));
}
