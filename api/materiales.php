<?php
/**
 * API Endpoint - Materiales
 * 
 * En esta ruta se consultan todos los materiales existentes en la base de datos
 * para mostrar en formulario de producto
 * 
 * Método: GET
 * Respuesta: Lista de materiales
 * 
 */

// Incluir archivo de configuración de base de datos
require_once '../config/config.php';

// Configurar headers para CORS y JSON
setHeaders(['GET']);

try {
    // Obtener conexión a la base de datos
    $pdo = getConnection();

    // Consulta para obtener todos los materiales
    $sql = "SELECT idMaterial, Nombre FROM Materiales ORDER BY idMaterial";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    // Obtener todos los resultados
    $materiales = $stmt->fetchAll();
    
    // Enviar respuesta exitosa
    sendJsonResponse(true, 'Materiales obtenidos correctamente', $materiales);

} catch (PDOException $e) {
    // Manejar errores de base de datos
    sendJsonResponse(false, 'Error de conexión a la base de datos', null, 500);

} catch (Exception $e) {
    // Manejar otros errores
    sendJsonResponse(false, 'Error interno del servidor', null, 500);
}
?>