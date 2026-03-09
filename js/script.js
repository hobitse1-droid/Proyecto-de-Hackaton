// =========================
// SCROLL SUAVE
// =========================
document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const target = btn.dataset.scroll;
    if (!target) return;
    const el = document.querySelector(target);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// =========================
// ANIMACIONES
// =========================
const animatedSections = document.querySelectorAll(".animate-on-scroll");

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

animatedSections.forEach((section) => observer.observe(section));

// =========================
// SIMULADOR + GRÁFICA
// =========================
const btnSimular = document.getElementById("btn-simular");
const montoInput = document.getElementById("monto");
const anioSelect = document.getElementById("anio");
const resultadoAnio = document.getElementById("resultado-anio");
const resultadoInversion = document.getElementById("resultado-inversion");
const resultadoMonto = document.getElementById("resultado-monto");
const resultadoPorcentaje = document.getElementById("resultado-porcentaje");

// Datos reales aproximados por año
const historialBTC = {
  2015: 250,
  2016: 500,
  2017: 4000,
  2018: 6000,
  2019: 8000,
  2020: 11000,
  2021: 45000,
  2022: 30000,
  2023: 40000,
  2024: 60000
};

let grafica = null;

function generarGrafica(anioInicio, inversion) {
  const canvas = document.getElementById("graficaBitcoin");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const años = Object.keys(historialBTC)
    .map(Number)
    .filter((a) => a >= anioInicio);

  const precios = años.map((a) => historialBTC[a]);

  const precioInicial = historialBTC[anioInicio];
  const btcComprados = inversion / precioInicial;
  const valores = precios.map((p) => p * btcComprados);

  if (grafica) grafica.destroy();

  grafica = new Chart(ctx, {
    type: "line",
    data: {
      labels: años,
      datasets: [
        {
          label: "Valor de tu inversión",
          data: valores,
          borderColor: "#FFD700",
          backgroundColor: "rgba(255,215,0,0.15)",
          borderWidth: 4,
          tension: 0.35,
          pointRadius: 5,
          pointBackgroundColor: "#FFD700",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: {
          ticks: { color: "#b8c0d9" },
          grid: { color: "rgba(255,255,255,0.05)" }
        },
        y: {
          ticks: {
            color: "#b8c0d9",
            callback: (value) => "$" + value.toLocaleString("es-MX")
          },
          grid: { color: "rgba(255,255,255,0.05)" }
        }
      }
    }
  });
}

btnSimular?.addEventListener("click", () => {
  const monto = Number(montoInput.value);
  const anio = Number(anioSelect.value);

  if (!monto || monto < 100 || !historialBTC[anio]) {
    resultadoAnio.textContent = "-";
    resultadoInversion.textContent = "$0";
    resultadoMonto.textContent = "$0";
    resultadoPorcentaje.textContent = "0%";
    return;
  }

  generarGrafica(anio, monto);

  const precioInicial = historialBTC[anio];
  const precioFinal = historialBTC[2024];
  const btcComprados = monto / precioInicial;
  const valorHoy = btcComprados * precioFinal;
  const crecimiento = ((valorHoy - monto) / monto) * 100;

  resultadoAnio.textContent = anio;
  resultadoInversion.textContent = `$${monto.toLocaleString("es-MX")}`;
  resultadoMonto.textContent = `$${valorHoy.toLocaleString("es-MX")}`;
  resultadoPorcentaje.textContent = `${crecimiento.toFixed(0)}%`;
});

// =========================
// PRECIO ACTUAL BITCOIN
// =========================
const precioActualEl = document.getElementById("precio-actual");
const precioCambioEl = document.getElementById("precio-cambio");

async function cargarPrecioBitcoin() {
  if (!precioActualEl || !precioCambioEl) return;

  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=mxn&include_24hr_change=true"
    );
    const data = await res.json();
    const precio = data.bitcoin.mxn;
    const cambio = data.bitcoin.mxn_24h_change;

    precioActualEl.textContent = `$${precio.toLocaleString("es-MX")}`;
    precioCambioEl.textContent = `${cambio.toFixed(2)}%`;
    precioCambioEl.style.color =
      cambio >= 0 ? "var(--accent-green)" : "var(--accent-red)";
  } catch (err) {
    precioActualEl.textContent = "No disponible";
    precioCambioEl.textContent = "Error";
    precioCambioEl.style.color = "var(--accent-red)";
  }
}

cargarPrecioBitcoin();