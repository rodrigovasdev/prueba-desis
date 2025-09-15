<?php
/**
 * Archivo de configuración y conexión a la base de datos PostgreSQL
 * Este archivo centraliza la conexión para todos los scripts PHP del proyecto
 */

// Configuración de la base de datos PostgreSQL
$config = [
    'host' => 'localhost',
    'dbname' => 'prueba_desis',
    'username' => 'postgres',
    'password' => 'a',
    'port' => '5432'
];

/**
 * Función para obtener una conexión PDO a PostgreSQL
 * @return PDO Objeto de conexión PDO configurado
 * @throws PDOException Si la conexión falla
 */
function getConnection() {
    global $config;
    
    try {
        $dsn = "pgsql:host={$config['host']};port={$config['port']};dbname={$config['dbname']};";
        $pdo = new PDO($dsn, $config['username'], $config['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        
        return $pdo;
        
    } catch (PDOException $e) {
        // Log del error (en producción, usar un sistema de logs apropiado)
        error_log("Error de conexión a la base de datos: " . $e->getMessage());
        throw new PDOException("Error de conexión a la base de datos");
    }
}

/**
 * Función para configurar headers CORS y JSON comunes
 * @param array $methods Métodos HTTP permitidos (por defecto: GET)
 */
function setHeaders($methods = ['GET']) {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: ' . implode(', ', $methods));
    header('Access-Control-Allow-Headers: Content-Type');
}

/**
 * Función para enviar respuesta JSON consistente
 * @param bool $success Indica si la operación fue exitosa
 * @param string $message Mensaje descriptivo
 * @param mixed $data Datos a devolver (opcional)
 * @param int $httpCode Código de respuesta HTTP (opcional)
 */
function sendJsonResponse($success, $message, $data = null, $httpCode = null) {
    if ($httpCode) {
        http_response_code($httpCode);
    }
    
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        if (is_array($data) && isset($data['data'])) {
            // Si $data ya tiene estructura con 'data' y 'total'
            $response = array_merge($response, $data);
        } else {
            // Si $data es solo los datos
            $response['data'] = $data;
            if (is_array($data)) {
                $response['total'] = count($data);
            }
        }
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
?>