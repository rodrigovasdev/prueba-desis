<?php
/**
 * API Endpoint - Sucursales
 * 
 * En esta ruta se consultan todas las sucursales existentes en la base de datos
 * según su bodega. 
 * 
 * Método: GET
 * Entrada: Nombre de bodega
 * Respuesta: Lista de sucursales
 * 
 */

// Incluir archivo de configuración de base de datos
require_once '../config/config.php';

// Configurar headers para CORS y JSON
setHeaders(['GET']);

try {
    // Obtener conexión a la base de datos
    $pdo = getConnection();

    // Obtener el nombre de la bodega desde los parámetros
    $nombreBodega = $_GET['bodega'] ?? null;

    // Validar que se proporcionó el nombre de la bodega
    if (empty($nombreBodega)) {
        sendJsonResponse(false, 'Debe proporcionar el nombre de la bodega', null, 400);
        exit;
    }

    // Consulta para obtener las sucursales de una bodega específica
    $sql = "SELECT s.idSucursal, s.Nombre, s.FK_Bodega, b.Nombre as NombreBodega
            FROM Sucursales s 
            INNER JOIN Bodegas b ON s.FK_Bodega = b.idBodega 
            WHERE LOWER(b.Nombre) = LOWER(:nombreBodega)
            ORDER BY s.Nombre";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':nombreBodega', $nombreBodega, PDO::PARAM_STR);
    $stmt->execute();
    
    // Obtener todos los resultados
    $sucursales = $stmt->fetchAll();
    
    // Enviar respuesta exitosa
    if (count($sucursales) > 0) {
        sendJsonResponse(true, 'Sucursales obtenidas correctamente', [
            'bodega' => $nombreBodega,
            'data' => $sucursales,
            'total' => count($sucursales)
        ]);
    } else {
        sendJsonResponse(true, 'No se encontraron sucursales para la bodega especificada', [
            'bodega' => $nombreBodega,
            'data' => [],
            'total' => 0
        ]);
    }

} catch (PDOException $e) {
    // Manejar errores de base de datos
    sendJsonResponse(false, 'Error de conexión a la base de datos', null, 500);

} catch (Exception $e) {
    // Manejar otros errores
    sendJsonResponse(false, 'Error interno del servidor', null, 500);
}
?>