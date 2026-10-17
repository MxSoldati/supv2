<?php
// public_html/api.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Prevenir que los navegadores o el servidor guarden en caché la respuesta
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$file = __DIR__ . '/productos.json';
$adminPassword = 'supleadmin2026';

// 1. LEER CATaLOGO (Cualquier usuario que entra desde su celular o PC)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo json_encode(null);
    }
    exit;
}

// 2. GUARDAR CAMBIOS (Cuando el admin edita, agrega, borra o importa un Excel)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!isset($input['password']) || $input['password'] !== $adminPassword) {
        http_response_code(401);
        echo json_encode(["error" => "Contraseña de administrador inválida"]);
        exit;
    }

    if (isset($input['products']) && is_array($input['products'])) {
        $saved = file_put_contents($file, json_encode($input['products'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        if ($saved === false) {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo escribir productos.json en el servidor"]);
            exit;
        }
        echo json_encode(["status" => "ok", "count" => count($input['products'])]);
        exit;
    }

    http_response_code(400);
    echo json_encode(["error" => "Formato de productos invalido"]);
    exit;
}

// 3. RESTAURAR DE FABRICA (Cuando el admin toca "Restaurar Datos Originales")
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!isset($input['password']) || $input['password'] !== $adminPassword) {
        http_response_code(401);
        echo json_encode(["error" => "No autorizado"]);
        exit;
    }

    if (file_exists($file)) {
        unlink($file);
    }
    echo json_encode(["status" => "reset_ok"]);
    exit;
}