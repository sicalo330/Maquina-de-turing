// Máquina de Turing simplificada para validar contraseñas alfanuméricas (≥ 8)
class TuringMachine {
  constructor(input) {
    this.tape = input.split("");
    this.head = 0;
    this.state = "q0";
    this.acceptState = "HALT";
    this.blank = "_";
  }

  read() {
    //this.tape es un array que separa cada caracter, this.head es la posición actual del cabezal
    //Empieza en 0 y avanza hasta que encuentra un espacio en blanco (this.blank)
    return this.tape[this.head] || this.blank;
  }

  move() {
    this.head++;
  }

  step() {
    const symbol = this.read();
    // return
    // Solo acepta letras o números
    const isAlphanumeric = /^[a-zA-Z0-9]$/.test(symbol);

    switch (this.state) {
      case "q0":
        if (isAlphanumeric) {
          this.move();
          this.state = "q0";
        } else if (symbol === this.blank) {//Entra a este if cuando llega al final de la cadena
          // Si llegamos al final, verificamos la longitud
          if (this.tape.length >= 8) {//Si es mayor o igual a 8 acepta la contraseña
            this.state = this.acceptState;
          } else {//Si no es mayor o igual a 8 rechaza la contraseña
            this.state = "REJECT";
          }
        } else {//Lleg a a este else cuando encuentra un símbolo no alfanumérico
          this.state = "REJECT";
        }
        break;
    }
  }

  run() {
    while (this.state !== this.acceptState && this.state !== "REJECT") {
        // console.log(`Estado: ${this.state}, Cabezal: ${this.head}, Símbolo leído: '${this.read()}'`);
        // return
      this.step();
    }
    return this.state === this.acceptState;
  }
}

// Enlazamos al formulario
const form = document.getElementById("simpleForm");
const input = document.getElementById("passwordInput");
const resultado = document.getElementById("resultado");

form.addEventListener("submit", (event) => {
  event.preventDefault();//Hace que la pagina no se recargue al enviar el formulario
  const valor = input.value;

  const tm = new TuringMachine(valor);
  const esValida = tm.run();

//   return

  if (esValida) {
    console.log("Contraseña válida:", valor);
    resultado.textContent = "✅ Contraseña aceptada";
    resultado.style.color = "green";
  } else {
    console.log("Contraseña inválida:", valor);
    resultado.textContent = "❌ Contraseña inválida (debe ser alfanumérica y tener al menos 8 caracteres)";
    resultado.style.color = "red";
  }
});
