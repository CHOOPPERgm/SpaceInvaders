function cargarRanking() {
    fetch("obtener_ranking.php")
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
            document.getElementById("Ranking").innerHTML = 
                `<tr><td colspan="6" class="sin-datos">Error al conectar con la base de datos.</td></tr>`;
        });
}