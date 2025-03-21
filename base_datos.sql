-- Crear la base de datos (opcional)
CREATE DATABASE IF NOT EXISTS lavanderia;
USE lavanderia;

-- Crear la tabla de pedidos
CREATE TABLE pedidos (
    id VARCHAR(10) PRIMARY KEY, -- ID único del pedido
    nombre VARCHAR(100),        -- Nombre del cliente
    telefono VARCHAR(15),       -- Número de teléfono del cliente
    producto VARCHAR(100),      -- Producto que se desea lavar
    estado VARCHAR(50)          -- Estado del pedido (ej. En proceso, Listo para retirar)
);
