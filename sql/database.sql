-- Script SQL para PostgreSQL
-- Base de datos: prueba_desis

-- Conectarse a la base de datos prueba_desis antes de ejecutar lo siguiente

-- =============================================
-- TABLA: BODEGAS
-- =============================================
CREATE TABLE Bodegas (
    idBodega SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL
);

-- =============================================
-- TABLA: SUCURSALES
-- =============================================
CREATE TABLE Sucursales (
    idSucursal SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    FK_Bodega INTEGER NOT NULL,
    FOREIGN KEY (FK_Bodega) REFERENCES Bodegas(idBodega) ON DELETE CASCADE
);

-- =============================================
-- TABLA: MONEDAS
-- =============================================
CREATE TABLE Monedas (
    idMoneda SERIAL PRIMARY KEY,
    Codigo VARCHAR(10) NOT NULL UNIQUE,
    Nombre VARCHAR(100) NOT NULL
);

-- =============================================
-- TABLA: MATERIALES
-- =============================================
CREATE TABLE Materiales (
    idMaterial SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL
);

-- =============================================
-- TABLA: PRODUCTOS
-- =============================================
CREATE TABLE Productos (
    idProducto SERIAL PRIMARY KEY,
    Codigo VARCHAR(15) NOT NULL UNIQUE,
    Nombre VARCHAR(50) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    Descripcion TEXT NOT NULL,
    FK_Bodega INTEGER NOT NULL,
    FK_Sucursal INTEGER NOT NULL,
    FK_Moneda INTEGER NOT NULL,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FK_Bodega) REFERENCES Bodegas(idBodega),
    FOREIGN KEY (FK_Sucursal) REFERENCES Sucursales(idSucursal),
    FOREIGN KEY (FK_Moneda) REFERENCES Monedas(idMoneda),
    -- Restricciones
    CONSTRAINT chk_codigo_longitud CHECK (LENGTH(Codigo) >= 5 AND LENGTH(Codigo) <= 15),
    CONSTRAINT chk_precio_positivo CHECK (Precio > 0),
    CONSTRAINT chk_descripcion_longitud CHECK (LENGTH(Descripcion) >= 10 AND LENGTH(Descripcion) <= 1000)
);

-- =============================================
-- TABLA: PRODUCTO_MATERIALES (Relación muchos a muchos)
-- =============================================
CREATE TABLE Producto_Materiales (
    idProductoMaterial SERIAL PRIMARY KEY,
    FK_Producto INTEGER NOT NULL,
    FK_Material INTEGER NOT NULL,
    FOREIGN KEY (FK_Producto) REFERENCES Productos(idProducto) ON DELETE CASCADE,
    FOREIGN KEY (FK_Material) REFERENCES Materiales(idMaterial),
    UNIQUE (FK_Producto, FK_Material)
);

-- =============================================
-- INSERTAR DATOS INICIALES
-- =============================================

-- Insertar Bodegas
INSERT INTO Bodegas (Nombre) VALUES 
('Bodega Central'),
('Bodega Norte'),
('Bodega Sur'),
('Bodega Este');

-- Insertar Sucursales
INSERT INTO Sucursales (Nombre, FK_Bodega) VALUES 
-- Sucursales de Bodega Central (ID: 1)
('BC Sucursal Centro', 1),
('BC Sucursal Plaza', 1),
('BC Sucursal Sur', 1),
('BC Sucursal Norte', 1),
-- Sucursales de Bodega Norte (ID: 2)
('BN Sucursal Centro', 2),
('BN Sucursal Plaza', 2),
('BN Sucursal Sur', 2),
('BN Sucursal Norte', 2),
-- Sucursales de Bodega Sur (ID: 3)
('BS Sucursal Centro', 3),
('BS Sucursal Plaza', 3),
('BS Sucursal Sur', 3),
('BS Sucursal Norte', 3),
-- Sucursales de Bodega Este (ID: 4)
('BE Sucursal Centro', 4),
('BE Sucursal Plaza', 4),
('BE Sucursal Sur', 4),
('BE Sucursal Norte', 4);

-- Insertar Monedas
INSERT INTO Monedas (Codigo, Nombre) VALUES 
('CLP', 'Peso Chileno'),
('USD', 'Dólar Estadounidense'),
('EUR', 'Euro'),
('COP', 'Peso Colombiano'),
('MXN', 'Peso Mexicano'),
('CAD', 'Dólar Canadiense');

-- Insertar Materiales
INSERT INTO Materiales (Nombre) VALUES 
('Plástico'),
('Metal'),
('Madera'),
('Vidrio'),
('Textil');