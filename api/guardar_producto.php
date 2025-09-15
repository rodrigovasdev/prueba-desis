<?php
/**
 * API Endpoint - Guardar Producto
 * 
 * En esta ruta se procesa la creación de un nuevo producto en la base de datos.
 * Valida los datos de entrada, verifica que el código del producto no exista,
 * inserta el producto y asocia los materiales seleccionados.
 * 
 * Método: POST
 * Entrada: JSON con código, nombre, bodega, sucursal, moneda, precio, descripción y materiales
 * Respuesta: Confirmación de guardado exitoso o mensaje de error
 * 
 */

// Incluir archivo de configuración de base de datos
require_once '../config/config.php';

// Configurar headers para CORS y JSON
setHeaders(['POST']);

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'error' => 'Método no permitido. Solo se acepta POST.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Obtener datos JSON del cuerpo de la petición
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('No se pudieron obtener los datos JSON');
    }
    
    // Validar campos requeridos
    $camposRequeridos = ['codigo', 'nombre', 'bodega', 'sucursal', 'moneda', 'precio', 'descripcion', 'materiales'];
    foreach ($camposRequeridos as $campo) {
        if (!isset($data[$campo]) || (is_string($data[$campo]) && trim($data[$campo]) === '')) {
            throw new Exception("El campo '$campo' es requerido");
        }
    }
    
    // Validar que materiales sea un array y tenga al menos 2 elementos
    if (!is_array($data['materiales']) || count($data['materiales']) < 2) {
        throw new Exception('Debe seleccionar al menos 2 materiales');
    }
    
    // Validar formato de precio
    if (!is_numeric($data['precio']) || floatval($data['precio']) <= 0) {
        throw new Exception('El precio debe ser un número positivo');
    }
    
    // Obtener conexión a la base de datos
    $pdo = getConnection();
    
    // Iniciar transacción
    $pdo->beginTransaction();
    
    try {
        // Verificar que el código no exista
        $sqlCheck = "SELECT COUNT(*) as count FROM Productos WHERE UPPER(Codigo) = UPPER(:codigo)";
        $stmtCheck = $pdo->prepare($sqlCheck);
        $stmtCheck->bindParam(':codigo', $data['codigo'], PDO::PARAM_STR);
        $stmtCheck->execute();
        $existeCodigo = $stmtCheck->fetch()['count'] > 0;
        
        if ($existeCodigo) {
            throw new Exception('El código del producto ya está registrado');
        }
        
        // Insertar producto
        $sqlProducto = "INSERT INTO Productos (Codigo, Nombre, Precio, Descripcion, FK_Bodega, FK_Sucursal, FK_Moneda) 
                       VALUES (:codigo, :nombre, :precio, :descripcion, :bodega, :sucursal, :moneda) 
                       RETURNING idProducto";
        
        $stmtProducto = $pdo->prepare($sqlProducto);
        $stmtProducto->bindParam(':codigo', $data['codigo'], PDO::PARAM_STR);
        $stmtProducto->bindParam(':nombre', $data['nombre'], PDO::PARAM_STR);
        $stmtProducto->bindParam(':precio', $data['precio'], PDO::PARAM_STR);
        $stmtProducto->bindParam(':descripcion', $data['descripcion'], PDO::PARAM_STR);
        $stmtProducto->bindParam(':bodega', $data['bodega'], PDO::PARAM_INT);
        $stmtProducto->bindParam(':sucursal', $data['sucursal'], PDO::PARAM_INT);
        $stmtProducto->bindParam(':moneda', $data['moneda'], PDO::PARAM_INT);
        $stmtProducto->execute();
        
        // Obtener el ID del producto insertado
        $resultado = $stmtProducto->fetch();
        $idProducto = $resultado['idproducto'];
        
        // Insertar materiales del producto
        $sqlMaterial = "INSERT INTO Producto_Materiales (FK_Producto, FK_Material) VALUES (:producto, :material)";
        $stmtMaterial = $pdo->prepare($sqlMaterial);
        
        foreach ($data['materiales'] as $idMaterial) {
            $stmtMaterial->bindParam(':producto', $idProducto, PDO::PARAM_INT);
            $stmtMaterial->bindParam(':material', $idMaterial, PDO::PARAM_INT);
            $stmtMaterial->execute();
        }
        
        // Confirmar transacción
        $pdo->commit();
        
        // Respuesta exitosa
        echo json_encode([
            'ok' => true,
            'message' => 'Producto guardado exitosamente',
            'idProducto' => $idProducto,
            'codigo' => $data['codigo'],
            'materialesInsertados' => count($data['materiales'])
        ]);
        
    } catch (Exception $e) {
        // Revertir transacción en caso de error
        $pdo->rollBack();
        throw $e;
    }

} catch (PDOException $e) {
    // Error de base de datos
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Error de base de datos: ' . $e->getMessage()
    ]);

} catch (Exception $e) {
    // Otros errores
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => $e->getMessage()
    ]);
}
?>