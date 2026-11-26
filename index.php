<?php
require 'BDD.php';
$naves = $conn->query("SELECT * FROM naves");
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Space Invaders PHP + MySQL</title>
    <style>
        body {
            background-color: #0d0d0d;
            color: #fff;
            font-family: 'Courier New', Courier, monospace;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 20px;
        }
        h1 { color: #0f0; text-shadow: 0 0 10px #0f0; }
        canvas {
            background-color: #000;
            border: 2px solid #0f0;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
            display: none;
        }
        .panel {
            background: #1a1a1a;
            padding: 20px;
            border: 1px solid #0f0;
            margin-bottom: 20px;
            text-align: center;
            border-radius: 5px;
        }
        input, select, button {
            padding: 10px;
            margin: 5px;
            font-family: inherit;
            background: #000;
            color: #fff;
            border: 1px solid #0f0;
        }
        button {
            background: #0f0;
            color: #000;
            font-weight: bold;
            cursor: pointer;
        }
        button:hover { background: #0c0; }

        .contenedor-ranking {
            width: 100%;
            max-width: 750px;
            margin-top: 25px;
            background: #141414;
            padding: 15px;
            border: 1px solid #333;
            border-radius: 5px;
        }
        .header-ranking {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border-bottom: 1px solid #333;
            padding: 10px;
            text-align: center;
        }
        th {
            background-color: #1f1f1f;
            color: #0f0;
            text-transform: uppercase;
            font-size: 0.9em;
        }
        tr:hover { background-color: #222; }
        
        .top-1 { color: #FFD700; font-weight: bold; }
        .top-2 { color: #C0C0C0; font-weight: bold; }
        .top-3 { color: #CD7F32; font-weight: bold; }
        .sin-datos { color: #888; font-style: italic; padding: 20px; }
    </style>
</head>
<body>

    <h1>SPACE INVADERS</h1>

    <div id="menu-inicio" class="panel">
        <input type="text" id="nickname" placeholder="Ingresa tu Nickname" maxlength="20" required>
        <select id="select-nave">
            <?php while($nave = $naves->fetch_assoc()): ?>
                <option value="<?= $nave['id_nave'] ?>" 
                        data-velocidad="<?= $nave['velocidad'] ?>" 
                        data-color="<?= $nave['color_hex'] ?>">
                    <?= $nave['nombre_nave'] ?> (Vel: <?= $nave['velocidad'] ?>)
                </option>
            <?php endwhile; ?>
        </select>
        <button onclick="iniciarJuego()">JUGAR</button>
    </div>

    <div id="hud" style="display:none; margin-bottom: 10px; font-size: 1.2em;">
        Jugador: <span id="hud-jugador" style="color:#0f0;"></span> | 
        Puntaje: <span id="hud-puntaje">0</span> | 
        Nivel: <span id="hud-nivel">1</span>
    </div>

    <canvas id="juegoCanvas" width="600" height="500"></canvas>

    <div class="contenedor-ranking">
        <div class="header-ranking">
            <h2 style="margin: 0; color: #0f0;">🏆 TABLA DE PUNTUACIÓN (TOP 10)</h2>
            <button onclick="cargarRanking()" style="padding: 5px 10px; font-size: 0.8em;">↻ Actualizar</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Jugador</th>
                    <th>Nave</th>
                    <th>Puntaje</th>
                    <th>Nivel</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody id="tabla-ranking">
                <tr><td colspan="6" class="sin-datos">Cargando puntuaciones...</td></tr>
            </tbody>
        </table>
    </div>

    <script src="juego.js"></script>
</body>
</html>