<?php
$host = "localhost";
$usuario = "root";
$password = "";
$base_datos = "spaceinvaders";

$conn = new mysqli($host, $usuario, $password, $base_datos);

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión: " . $conn->connect_error]));
}
$conn->set_charset("utf8");
?>