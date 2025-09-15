<?php
/**
 * API Endpoint - Bodegas
 * 
 * En esta ruta se consultan por todas las bodegas existentes en la base de datos,
 * para mostrar en formulario de producto
 * 
 * Método: GET
 * Respuesta: Lista de bodegas
 * 
 */

// Incluir archivo de configuración de base de datos
require_once '../config/config.php';

// Configurar headers para CORS y JSON
setHeaders(['GET']);

try {
    // Obtener conexión a la base de datos
    $pdo = getConnection();

    // Consulta para obtener todas las bodegas
    $sql = "SELECT idBodega, Nombre FROM Bodegas ORDER BY Nombre";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    // Obtener todos los resultados
    $bodegas = $stmt->fetchAll();
    
    // Enviar respuesta exitosa
    sendJsonResponse(true, 'Bodegas obtenidas correctamente', $bodegas);

} catch (PDOException $e) {
    // Manejar errores de base de datos
    sendJsonResponse(false, 'Error de conexión a la base de datos', null, 500);

} catch (Exception $e) {
    // Manejar otros errores
    sendJsonResponse(false, 'Error interno del servidor', null, 500);
}
?>
