// Write JavaS// Configuración Twitch
const clientId = "aqsiwhh0et4lwfrcb6qky6dwe8ig4l"; 
const redirectUri = "https://milozanoo22-cpu.github.io/Mundostreaming"; 

// ----------- 1. Autenticación con Twitch -------------
document.getElementById("loginTwitch").addEventListener("click", () => {
  const url = `https://id.twitch.tv/oauth2/authorize
    ?client_id=${clientId}
    &redirect_uri=${redirectUri}
    &response_type=token
    &scope=user:read:email`.replace(/\s+/g, '');

  window.location.href = url;
});

// Capturar token de la URL tras login
if (window.location.hash.includes("access_token")) {
  const token = new URLSearchParams(window.location.hash.substring(1)).get("access_token");
  localStorage.setItem("twitch_token", token);
  document.getElementById("userInfo").innerText = "✅ Conectado a Twitch";
}

// ----------- 2. Sistema de Puntos -------------
function getPuntos() {
  const data = JSON.parse(localStorage.getItem("puntosData")) || { puntos: 0, fecha: null };
  return data;
}

function setPuntos(puntos) {
  const hoy = new Date();
  localStorage.setItem("puntosData", JSON.stringify({ puntos, fecha: hoy.toISOString() }));
  document.getElementById("puntosActuales").innerText = puntos;
}

function resetearSiExpira() {
  const guardado = getPuntos();
  if (!guardado.fecha) return;

  const ahora = new Date();
  const fechaGuardada = new Date(guardado.fecha);

  // Hora Colombia
  const zonaColombia = new Date().toLocaleString("en-US", { timeZone: "America/Bogota" });
  const ahoraCol = new Date(zonaColombia);

  if (ahoraCol.getDate() !== fechaGuardada.getDate()) {
    setPuntos(0); // reset al nuevo día
  }
}

resetearSiExpira();
setPuntos(getPuntos().puntos);

// ----------- 3. Agenda -------------
const horas = ["16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
let agenda = JSON.parse(localStorage.getItem("agenda")) || {};

function mostrarAgenda() {
  const div = document.getElementById("horasDisponibles");
  div.innerHTML = "";

  horas.forEach(hora => {
    const usuarios = agenda[hora] || [];
    const btn = document.createElement("button");
    btn.innerText = `${hora} (${usuarios.length}/2)`;

    btn.disabled = usuarios.length >= 2;

    btn.addEventListener("click", () => {
      const puntos = getPuntos().puntos;
      if (puntos >= 45) {
        usuarios.push("Yo (2h)");
      } else if (puntos >= 30) {
        usuarios.push("Yo (1h)");
      } else {
        alert("❌ No tienes suficientes puntos para agendar.");
        return;
      }
      agenda[hora] = usuarios;
      localStorage.setItem("agenda", JSON.stringify(agenda));
      mostrarAgenda();
    });

    div.appendChild(btn);
  });
}

mostrarAgenda();

// ----------- 4. Streamers en Vivo (simulado) -------------
const lista = document.getElementById("listaStreamers");
// Esto debería venir de la API de Twitch
const streamers = ["StreamerA", "StreamerB", "StreamerC"];

streamers.forEach(s => {
  const div = document.createElement("div");
  div.innerHTML = `${s} <button>Apoyar 45min</button>`;
  div.querySelector("button").addEventListener("click", () => {
    const actual = getPuntos().puntos;
    setPuntos(actual + 5); // +5 puntos por apoyar
  });
  lista.appendChild(div);
});

