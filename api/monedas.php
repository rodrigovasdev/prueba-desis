<?php
/**
 * API Endpoint - Monedas
 * 
 * En esta ruta se consultan todas las monedas existentes en la base de datos
 * para mostrar en formulario de producto
 * 
 * Método: GET
 * Respuesta: Lista de monedas
 * 
 */

// Incluir archivo de configuración de base de datos
require_once '../config/config.php';

// Configurar headers para CORS y JSON
setHeaders(['GET']);

try {
    // Obtener conexión a la base de datos
    $pdo = getConnection();

    // Consulta para obtener todas las monedas
    $sql = "SELECT idMoneda, Codigo, Nombre FROM Monedas ORDER BY Codigo";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    // Obtener todos los resultados
    $monedas = $stmt->fetchAll();
    
    // Enviar respuesta exitosa
    sendJsonResponse(true, 'Monedas obtenidas correctamente', $monedas);

} catch (PDOException $e) {
    // Manejar errores de base de datos
    sendJsonResponse(false, 'Error de conexión a la base de datos', null, 500);

} catch (Exception $e) {
    // Manejar otros errores
    sendJsonResponse(false, 'Error interno del servidor', null, 500);
}
?>