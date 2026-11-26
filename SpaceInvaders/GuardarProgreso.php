<?php
header('Content-Type: application/json');
require 'BDD.php';

$datos = json_decode(file_get_contents("php://input"), true);

if (!isset($datos['nickname'], $datos['id_nave'], $datos['puntaje'], $datos['nivel'])) {
    echo json_encode(["status" => "error", "mensaje" => "Datos incompletos"]);
    exit;
}

$nickname = trim($datos['nickname']);
$id_nave = (int)$datos['id_nave'];
$puntaje = (int)$datos['puntaje'];
$nivel = (int)$datos['nivel'];

// 1. Verificar o insertar jugador
$stmt = $conn->prepare("SELECT id_jugador FROM jugadores WHERE nickname = ?");
$stmt->bind_param("s", $nickname);
$stmt->execute();
$resultado = $stmt->get_result();

if ($fila = $resultado->fetch_assoc()) {
    $id_jugador = $fila['id_jugador'];
} else {
    $stmt_insert = $conn->prepare("INSERT INTO jugadores (nickname) VALUES (?)");
    $stmt_insert->bind_param("s", $nickname);
    $stmt_insert->execute();
    $id_jugador = $stmt_insert->insert_id;
    $stmt_insert->close();
}
$stmt->close();

// 2. Guardar la partida
$stmt_partida = $conn->prepare("INSERT INTO partidas (id_jugador, id_nave, puntaje, nivel_alcanzado) VALUES (?, ?, ?, ?)");
$stmt_partida->bind_param("iiii", $id_jugador, $id_nave, $puntaje, $nivel);

if ($stmt_partida->execute()) {
    echo json_encode(["status" => "ok", "mensaje" => "Progreso guardado correctamente"]);
} else {
    echo json_encode(["status" => "error", "mensaje" => "Error al guardar progreso"]);
}

$stmt_partida->close();
$conn->close();
?>