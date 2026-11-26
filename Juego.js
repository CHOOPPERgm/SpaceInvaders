const canvas = document.getElementById("juegoCanvas");
const ctx = canvas.getContext("2d");

let jugador = {};
let balas = [];
let enemigos = [];
let teclas = {};
let puntaje = 0;
let nivel = 1;
let direccionEnemigos = 1;
let juegoActivo = false;

// Controles
document.addEventListener("keydown", e => teclas[e.code] = true);
document.addEventListener("keyup", e => {
    teclas[e.code] = false;
    if (e.code === "Space" && juegoActivo) disparar();
});

function iniciarJuego() {
    const nicknameInput = document.getElementById("nickname").value.trim();
    if (!nicknameInput) {
        alert("Por favor ingresa un nickname.");
        return;
    }

    const selectNave = document.getElementById("select-nave");
    const opcion = selectNave.options[selectNave.selectedIndex];

    jugador = {
        nickname: nicknameInput,
        id_nave: selectNave.value,
        x: canvas.width / 2 - 20,
        y: canvas.height - 40,
        ancho: 40,
        alto: 20,
        velocidad: parseInt(opcion.getAttribute("data-velocidad")),
        color: opcion.getAttribute("data-color")
    };

    puntaje = 0;
    nivel = 1;
    balas = [];
    juegoActivo = true;

    document.getElementById("menu-inicio").style.display = "none";
    document.getElementById("hud").style.display = "block";
    canvas.style.display = "block";

    crearEnemigos();
    actualizarHUD();
    bucleJuego();
}

function crearEnemigos() {
    enemigos = [];
    const filas = 3 + Math.min(nivel, 3);
    const columnas = 8;
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            enemigos.push({
                x: 50 + c * 60,
                y: 40 + f * 40,
                ancho: 35,
                alto: 25,
                vivo: true
            });
        }
    }
}

function disparar() {
    balas.push({
        x: jugador.x + jugador.ancho / 2 - 2,
        y: jugador.y,
        ancho: 4,
        alto: 10,
        velocidad: 7
    });
}

function actualizar() {
    // Mover jugador
    if (teclas["ArrowLeft"] && jugador.x > 0) jugador.x -= jugador.velocidad;
    if (teclas["ArrowRight"] && jugador.x + jugador.ancho < canvas.width) jugador.x += jugador.velocidad;

    // Mover balas
    balas.forEach((b, index) => {
        b.y -= b.velocidad;
        if (b.y < 0) balas.splice(index, 1);
    });

    // Mover enemigos
    let tocarBorde = false;
    const velocidadEnemigo = 1 + (nivel * 0.4);

    enemigos.forEach(e => {
        if (!e.vivo) return;
        e.x += velocidadEnemigo * direccionEnemigos;
        if (e.x + e.ancho >= canvas.width || e.x <= 0) tocarBorde = true;

        // Verificar derrota si llegan abajo
        if (e.y + e.alto >= jugador.y) {
            terminarJuego();
        }
    });

    if (tocarBorde) {
        direccionEnemigos *= -1;
        enemigos.forEach(e => e.y += 20);
    }

    // Colisiones bala - enemigo
    balas.forEach((b, bIndex) => {
        enemigos.forEach(e => {
            if (e.vivo && b.x < e.x + e.ancho && b.x + b.ancho > e.x && b.y < e.y + e.alto && b.y + b.alto > e.y) {
                e.vivo = false;
                balas.splice(bIndex, 1);
                puntaje += 100;
                actualizarHUD();
            }
        });
    });

    // Verificar siguiente nivel
    if (enemigos.every(e => !e.vivo)) {
        nivel++;
        balas = [];
        actualizarHUD();
        crearEnemigos();
    }
}

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar jugador
    ctx.fillStyle = jugador.color;
    ctx.fillRect(jugador.x, jugador.y, jugador.ancho, jugador.alto);

    // Dibujar balas
    ctx.fillStyle = "#FFF";
    balas.forEach(b => ctx.fillRect(b.x, b.y, b.ancho, b.alto));

    // Dibujar enemigos
    ctx.fillStyle = "#FF0055";
    enemigos.forEach(e => {
        if (e.vivo) ctx.fillRect(e.x, e.y, e.ancho, e.alto);
    });
}

function bucleJuego() {
    if (!juegoActivo) return;
    actualizar();
    dibujar();
    requestAnimationFrame(bucleJuego);
}

function actualizarHUD() {
    document.getElementById("hud-puntaje").innerText = puntaje;
    document.getElementById("hud-nivel").innerText = nivel;
}

function terminarJuego() {
    juegoActivo = false;
    alert(`¡Juego Terminado! Puntaje final: ${puntaje}`);

    fetch("GuardarProgreso.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        nickname: jugador.nickname,
        id_nave: jugador.id_nave,
        puntaje: puntaje,
        nivel: nivel
    })
    })
    .then(res => res.json())
    .then(() => {
    cargarRanking();
    document.getElementById("menu-inicio").style.display = "block";
    canvas.style.display = "none";
    document.getElementById("hud").style.display = "none";
    });
}

function cargarRanking() {
    fetch("Ranking.php")
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("tabla-ranking");
            tbody.innerHTML = "";

            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="sin-datos">Aún no hay partidas registradas. ¡Sé el primero en jugar!</td></tr>`;
                return;
            }

            data.forEach((fila, index) => {
                const posicion = index + 1;
                let clasePodio = "";
                if (posicion === 1) clasePodio = "top-1";
                else if (posicion === 2) clasePodio = "top-2";
                else if (posicion === 3) clasePodio = "top-3";

                tbody.innerHTML += `
                    <tr class="${clasePodio}">
                        <td>${posicion}</td>
                        <td>${fila.nickname}</td>
                        <td style="color: ${fila.color_hex};">■ ${fila.nombre_nave}</td>
                        <td><strong>${fila.puntaje.toLocaleString()}</strong></td>
                        <td>Nv. ${fila.nivel_alcanzado}</td>
                        <td style="font-size: 0.85em; color: #aaa;">${fila.fecha}</td>
                    </tr>
                `;
            });
        })
        .catch(err => {
            console.error("Error cargando ranking:", err);
            document.getElementById("tabla-ranking").innerHTML = 
                `<tr><td colspan="6" class="sin-datos">Error al conectar con la base de datos.</td></tr>`;
        });
}

// Cargar el ranking al abrir la página
cargarRanking();