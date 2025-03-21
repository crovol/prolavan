const serverUrl = 'https://TUDOMINIO.onrender.com'; // Reemplaza con tu URL de Render

// Registrar un pedido
document.getElementById('pedidoForm').onsubmit = function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const producto = document.getElementById('producto').value;

    const nuevoPedido = {
        id: 'PED-' + Math.floor(Math.random() * 100000),
        nombre,
        telefono,
        producto,
        estado: 'En proceso'
    };

    fetch(`${serverUrl}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPedido)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        obtenerPedidos();
    })
    .catch(error => console.error('Error:', error));
};

// Obtener y mostrar pedidos
function obtenerPedidos() {
    fetch(`${serverUrl}/pedidos`)
        .then(response => response.json())
        .then(pedidos => {
            const tbody = document.querySelector('#pedidos tbody');
            tbody.innerHTML = '';
            pedidos.forEach(pedido => {
                const row = `
                    <tr>
                        <td>${pedido.id}</td>
                        <td>${pedido.nombre}</td>
                        <td>${pedido.telefono}</td>
                        <td>${pedido.producto}</td>
                        <td>${pedido.estado}</td>
                    </tr>`;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error('Error al obtener pedidos:', error));
}

// Cargar pedidos al iniciar
obtenerPedidos();
