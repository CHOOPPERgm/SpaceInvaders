<?php
header('Content-Type: application/json');
require 'BDD.php';

$sql = "SELECT 
            j.nickname, 
            n.nombre_nave, 
            n.color_hex,
            p.puntaje, 
            p.nivel_alcanzado,
            DATE_FORMAT(p.fecha_partida, '%d/%m/%Y %H:%i') AS fecha
        FROM partidas p
        INNER JOIN jugadores j ON p.id_jugador = j.id_jugador
        INNER JOIN naves n ON p.id_nave = n.id_nave
        ORDER BY p.puntaje DESC, p.nivel_alcanzado DESC
        LIMIT 10";

$resultado = $conn->query($sql);
$ranking = [];

while ($fila = $resultado->fetch_assoc()) {
    $ranking[] = $fila;
}

echo json_encode($ranking);
$conn->close();
?>