class TuringMachine {
  constructor(input) {
    const randomLeft = this.generarAleatorio(5);
    const randomRight = this.generarAleatorio(5);
    //Este es el simbolo blanco para decir que la palbra terminar
    this.blank = "_";
    //Fulltape es la cinta completa con las letras aleaotrias a los lados y el input en el medio
    const fullTape = randomLeft + input + this.blank + randomRight;

    //this.tape es un array con cada caracter de la cinta [h,a,l,l,o,_,x,y,z]
    this.tape = fullTape.split("");
    //Es la posicion inicial del cabezal
    this.head = randomLeft.length; 
    this.stateNumber = 0;
    this.state = "q0";
    this.acceptState = null;
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
    //Read toma el simbolo en la posicion del cabezal
    return this.tape[this.head] || this.blank;
  }

  step() {
    //El simbolo en la posicion del cabezal se asigna a la variable symbol
    const symbol = this.read();
    //Symbol se evalue para ver si es alfanumerico
    const isAlphanumeric = /^[a-zA-Z0-9]$/.test(symbol);

    //Entra al if si no ha sido rechazado y no ha alcanzado un estado de aceptación
    if (this.state !== "REJECT" && !this.acceptState) {
      //Si es alfanumerico entra al if
      if (isAlphanumeric) {
        this.head++;
        this.stateNumber++;
        if(this.stateNumber > 8){
          return;
        }
        this.state = `q${this.stateNumber}`;
      } else if (symbol === this.blank) {//Si es el simbolo blanco entra al if
        //Si tiene 8 o más caracteres se acepta
        if (this.stateNumber >= 8) {
          this.acceptState = this.state; 
        } else {//Si no entonces se rechaza
          this.state = "REJECT";
        }

      } else {//Si no es alfanumerico ni blanco entra al else y rechaza
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

//Esta función se ejecuta al enviar el formulario, básicamente es cargar
form.addEventListener("submit", (event) => {
  event.preventDefault();
  //Valor es el valor del input sin espacios al inicio o final
  const valor = input.value.trim();
  //Si no hay valor se sale de la función
  if (!valor) return;
  //Se crea una nueva instancia de la maquina de turing con el valor del input
  tm = new TuringMachine(valor);

  cintaContainer.style.display = "block";
  resultado.textContent = "";
  // palabra.textContent = `Cinta generada: ${tm.tape.join("")}`;
  palabra.style.color = "blue";

  actualizarVista();
});

//Esta función se ejecuta al hacer click en el botón siguiente
btnSiguiente.addEventListener("click", () => {
  //Siempre y cuando no haya terminado la máquina se da un paso
  if (!tm || tm.isFinished()){
    return;
  } 

  tm.step();
  actualizarVista();

  if (tm.state === "REJECT") {
    resultado.textContent = "Contraseña inválida (debe ser alfanumérica y tener al menos 8 caracteres)";
    resultado.style.color = "red";
  } else if (tm.acceptState) {
    resultado.textContent = `Estado de aceptación: ${tm.acceptState}`;
    resultado.style.color = "green";
  }
});

//Esta función actualiza la vista de la cinta y el estado actual
//Es algo estético nada lógico
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

  estado.textContent = `Estado actual: ${tm.state} | Cabezal en posición ${tm.head-5} | Símbolo leído: '${tm.read()}'`;
}
