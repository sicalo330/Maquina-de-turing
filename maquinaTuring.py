from secrets import choice
from typing import Dict, Tuple
# Clase genérica de Máquina de Turing

class TuringMachine:
    def __init__(self, transitions, start_state, accept_state, blank='_'):
        self.transitions = transitions
        self.state = start_state
        self.accept_state = accept_state
        self.blank = blank
        self.tape = {}
        self.head = 0
        self.step_count = 0

    #Parece que inicializa variables para usarse en el futuro
    def load(self, input_str: str):
        #Este es importante, crea un diccionario con los índices y los caracteres de la cadena de entrada
        #Si el input fue 11+1_ el self.tape sería {0:'1', 1:'1', 2:'+', 3:'1', 4:'_'}
        self.tape = {i:ch for i, ch in enumerate(input_str)}
        self.head = 0
        self.state = 'q0'
        self.step_count = 0

    def read(self):
        return self.tape.get(self.head, self.blank)

    def write(self, symbol):
        self.tape[self.head] = symbol

    def move(self, direction):
        if direction == 'R':
            self.head += 1
        elif direction == 'L':
            self.head -= 1

    def step(self):
        symbol = self.read()
        key = (self.state, symbol)
        if key not in self.transitions:
            return True  # detener
        write_sym, direction, next_state = self.transitions[key]
        self.write(write_sym)
        self.move(direction)
        self.state = next_state
        self.step_count += 1
        return self.state == self.accept_state

    def run(self, max_steps=1000, verbose=False):
        #Se pone "_" porque no es importante
        ciclo = 0
        for _ in range(max_steps):
            ciclo += 1
            if verbose:
                self.print_tape()#Al parecer
            halted = self.step()
            if halted:
                break
        if verbose:
            print("Máquina detenida en estado:", self.state)
        return self.get_tape_str()

    def get_tape_str(self):
        if not self.tape:
            return ""
        left = min(self.tape.keys())
        right = max(self.tape.keys())
        return "".join(self.tape.get(i, self.blank) for i in range(left, right + 1))

    def print_tape(self):
        left = min(self.tape.keys()) - 2
        right = max(self.tape.keys()) + 2
        output = []
        for i in range(left, right + 1):
            cell = self.tape.get(i, self.blank)
            #Este if es solo algo estetico, resalta la posición de la cabeza de lectura
            if i == self.head:
                output.append(f"[{cell}]")
            else:
                output.append(f" {cell} ")
        print("".join(output))

# Módulos de máquinas

#Función para suma unaria
def unary_sum_machine():
    """
    Suma unaria: convierte 111+11 en 111111
    """
    transitions = {
        ('q0', '1'): ('1', 'R', 'q0'),
        ('q0', '+'): ('1', 'R', 'q1'),
        ('q1', '1'): ('1', 'R', 'q1'),
        ('q1', '_'): ('_', 'N', 'HALT')
    }
    return TuringMachine(transitions, start_state='q0', accept_state='HALT')

#Funcion para la forma a^n b^n c^n (n >= 1)
def ensure_blank(s: str, blank: str = '_') -> str:
    """Asegura que la cinta termine con el símbolo blank (por convención '_')."""
    return s if s.endswith(blank) else s + blank

def abc_equal_machine():
    """
    Máquina de Turing que reconoce L = { a^n b^n c^n | n >= 1 }.
    Usa las marcas X, Y, Z para cada a, b, c emparejadas.
    """
    transitions = {
        # q0: buscar una 'a' sin marcar
        ('q0', 'a'): ('X', 'R', 'q1'),
        ('q0', 'X'): ('X', 'R', 'q0'),
        ('q0', 'Y'): ('Y', 'R', 'q_check'),
        ('q0', 'Z'): ('Z', 'R', 'q_check'),
        ('q0', 'b'): ('b', 'N', 'q_reject'),
        ('q0', 'c'): ('c', 'N', 'q_reject'),
        ('q0', '_'): ('_', 'N', 'q_check'),

        # q1: buscar una 'b' sin marcar
        ('q1', 'a'): ('a', 'R', 'q1'),
        ('q1', 'X'): ('X', 'R', 'q1'),
        ('q1', 'Y'): ('Y', 'R', 'q1'),
        ('q1', 'b'): ('Y', 'R', 'q2'),
        ('q1', 'c'): ('c', 'N', 'q_reject'),
        ('q1', '_'): ('_', 'N', 'q_reject'),

        # q2: buscar una 'c' sin marcar
        ('q2', 'b'): ('b', 'R', 'q2'),
        ('q2', 'Y'): ('Y', 'R', 'q2'),
        ('q2', 'Z'): ('Z', 'R', 'q2'),
        ('q2', 'c'): ('Z', 'L', 'q3'),
        ('q2', '_'): ('_', 'N', 'q_reject'),

        # q3: regresar al inicio (izquierda) hasta encontrar la primera X
        ('q3', 'a'): ('a', 'L', 'q3'),
        ('q3', 'b'): ('b', 'L', 'q3'),
        ('q3', 'c'): ('c', 'L', 'q3'),
        ('q3', 'X'): ('X', 'R', 'q0'),
        ('q3', 'Y'): ('Y', 'L', 'q3'),
        ('q3', 'Z'): ('Z', 'L', 'q3'),
        ('q3', '_'): ('_', 'R', 'q0'),

        # q_check: verificar que solo queden X, Y, Z o _
        ('q_check', 'X'): ('X', 'R', 'q_check'),
        ('q_check', 'Y'): ('Y', 'R', 'q_check'),
        ('q_check', 'Z'): ('Z', 'R', 'q_check'),
        ('q_check', '_'): ('_', 'N', 'HALT'),

        # cualquier símbolo restante no marcado => rechazo
        ('q_check', 'a'): ('a', 'N', 'q_reject'),
        ('q_check', 'b'): ('b', 'N', 'q_reject'),
        ('q_check', 'c'): ('c', 'N', 'q_reject'),
    }

    return TuringMachine(transitions, start_state='q0', accept_state='HALT')


# Menú principal (extensible)

def main():
    print("=== Máquina de Turing (Consola) ===")
    print("1. Suma Unaria")
    print("2. Reconocer lenguajes L = { aⁿ bⁿ cⁿ | n ≥ 1 }")
    print("3. (Próximamente) Comparación Unaria")
    print("0. Salir")

    choice = input("Seleccione una opción: ")

    if choice == '0':
        print("Saliendo...")
        return
    elif choice == '1':
        num1 = input("Ingrese el primer número unario (ej. 111): ").strip()
        num2 = input("Ingrese el segundo número unario (ej. 11): ").strip()
        tape_input = f"{num1}+{num2}_"
        tm = unary_sum_machine()#Toma los valores de la máquina de suma unaria
        #Y tm tiene los métodos de la clase TuringMachine
        tm.load(tape_input)#Usa el método load para cargar la cinta
        print("\nEjecutando...\n")
        result = tm.run(verbose=True)#Usa el método run para ejecutar la máquina
        print("\nResultado final:", result)
        return
    elif choice == '2':
        cadena = input("Ingrese una cadena (ej. aaabbbccc): ").strip()
        cadena = ensure_blank(cadena)      # <-- añade '_' si falta (no toca opción 1)
        tm = abc_equal_machine()
        tm.load(cadena)
        print("\nEjecutando...\n")
        result = tm.run(verbose=True)
        if tm.state == 'HALT':
            print("\n Cadena aceptada.")
        else:
            print("\n Cadena rechazada.")
        print("\nCinta final:", result)
    else:
        print("Opción no válida. Saliendo...")
        return
if __name__ == "__main__":
    main()
