// Configura tus credenciales de Twitch
const clientId = "TU_CLIENT_ID";
const redirectUri = window.location.origin + window.location.pathname;

const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");

// ------------------ LOGIN ------------------
document.getElementById("loginTwitch").addEventListener("click", () => {
  const scope = "user:read:email";
  const url = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
  window.location.href = url;
});

// Captura el token
function handleLogin() {
  if (window.location.hash.includes("access_token")) {
    const token = new URLSearchParams(window.location.hash.substring(1)).get("access_token");
    localStorage.setItem("twitch_token", token);
    window.location.hash = "";
  }

  const token = localStorage.getItem("twitch_token");
  if (token) {
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
  }
}

handleLogin();

// ------------------ LOGOUT ------------------
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("twitch_token");
  location.reload();
});

// ------------------ SISTEMA DE PUNTOS ------------------
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
  const ahoraCol = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }));
  const fechaGuardada = new Date(guardado.fecha);
  if (ahoraCol.getDate() !== fechaGuardada.getDate()) {
    setPuntos(0);
  }
}

resetearSiExpira();
setPuntos(getPuntos().puntos);

// ------------------ AGENDA ------------------
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
      if (puntos >= 45) usuarios.push("Yo (2h)");
      else if (puntos >= 30) usuarios.push("Yo (1h)");
      else return alert("❌ No tienes suficientes puntos.");
      agenda[hora] = usuarios;
      localStorage.setItem("agenda", JSON.stringify(agenda));
      mostrarAgenda();
    });
    div.appendChild(btn);
  });
}
mostrarAgenda();

// ------------------ STREAMERS EN VIVO ------------------
const lista = document.getElementById("listaStreamers");
const streamers = ["StreamerA", "StreamerB", "StreamerC"];

streamers.forEach(s => {
  const div = document.createElement("div");
  div.innerHTML = `${s} <button class='twitch-btn'>Apoyar 45min</button>`;
  div.querySelector("button").addEventListener("click", () => {
    const actual = getPuntos().puntos;
    setPuntos(actual + 5);
  });
  lista.appendChild(div);
});
