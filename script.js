class TuringMachine {
  constructor(input) {
    const randomLeft = this.generarAleatorio(5);
    const randomRight = this.generarAleatorio(5);
    const fullTape = randomLeft + input + randomRight;

    this.tape = fullTape.split("");
    this.head = randomLeft.length; // Comienza justo al inicio del input
    this.stateNumber = 0; // Contador de estados
    this.state = "q0";
    this.acceptState = null; // se define dinámicamente al final
    this.blank = "_";
  }

  generarAleatorio(n) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let out = "";
    for (let i = 0; i < n; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  }

  read() {
    return this.tape[this.head] || this.blank;
  }

  move() {
    this.head++;
  }

  step() {
    const symbol = this.read();
    const isAlphanumeric = /^[a-zA-Z0-9]$/.test(symbol);

    // Solo continuar si no ha terminado
    if (this.state !== "REJECT" && !this.acceptState) {
      if (isAlphanumeric) {
        this.move();
        this.stateNumber++;
        this.state = `q${this.stateNumber}`;

        // Si llega al final de la cinta, genera estado de aceptación dinámico
        if (this.head >= this.tape.length) {
          this.acceptState = this.state;
        }
      } else if (symbol === this.blank) {
        if(this.stateNumber >= 8){
          this.acceptState = this.state; // acepta al encontrar blanco al final
        }
        else{
          this.state = "REJECT";
        }
      } else {
        this.state = "REJECT";
      }
    }
  }

  isFinished() {
    return this.acceptState || this.state === "REJECT";
  }
}

// Referencias al DOM
const form = document.getElementById("simpleForm");
const input = document.getElementById("passwordInput");
const resultado = document.getElementById("resultado");
const palabra = document.getElementById("palabra");
const cintaDiv = document.getElementById("cinta");
const estado = document.getElementById("estado");
const cintaContainer = document.getElementById("cintaContainer");
const btnSiguiente = document.getElementById("btnSiguiente");

let tm = null;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const valor = input.value.trim() + "_";
  if (!valor) return;

  tm = new TuringMachine(valor);

  cintaContainer.style.display = "block";
  resultado.textContent = "";
  palabra.textContent = `Cinta generada: ${tm.tape.join("")}`;
  palabra.style.color = "blue";

  actualizarVista();
});

btnSiguiente.addEventListener("click", () => {
  if (!tm || tm.isFinished()) return;

  tm.step();
  actualizarVista();

  if (tm.state === "REJECT") {
    resultado.textContent = "❌ Contraseña inválida (debe ser alfanumérica y tener al menos 8 caracteres)";
    resultado.style.color = "red";
  } else if (tm.acceptState) {
    resultado.textContent = `✅ Estado de aceptación: ${tm.acceptState}`;
    resultado.style.color = "green";
  }
});

function actualizarVista() {
  cintaDiv.innerHTML = "";
  tm.tape.forEach((char, index) => {
    const celda = document.createElement("span");
    celda.classList.add("celda");
    celda.textContent = char;
    if (index === tm.head) {
      celda.classList.add("cabezal");
    }
    cintaDiv.appendChild(celda);
  });

  estado.textContent = `Estado actual: ${tm.state} | Cabezal en posición ${tm.head} | Símbolo leído: '${tm.read()}'`;
}
