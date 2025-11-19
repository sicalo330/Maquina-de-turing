Autor:Noah Esteban Narváez Jung
Fase 1
Este proyecto requiere validar cadenas formadas únicamente por símbolos alfanuméricos, donde la Máquina de Turing debe detectar el final de la palabra mediante un símbolo de blanco _.
El regex garantiza exactamente ese comportamiento:
-^[a-zA-Z0-9]+_$ es el regiex que se eligió y acepta tanto números como dígitos
-_ representa el espacio blanco
-^ y $ → Aseguran que toda la cadena cumpla el patrón y no contenga otros símbolos
Este regex coincide con la validación implementada en el cógigo, donde cada símbolo se verifica usando:
/^[a-zA-Z0-9]$/.test(symbol)

La quinta tupla es la siguiente

Q = {q0, q1, q2, q3, q4, q5, q6, q7, qf}
Σ = {A–Z, a–z, 0–9}
Γ = {Z0, A}
q0 = Estado inicial
F = {qf}

δ(q0, a, Z0)  ⟶ (q1, A Z0)
δ(q1, a, A)   ⟶ (q2, A A)
δ(q2, a, A)   ⟶ (q3, A A)
δ(q3, a, A)   ⟶ (q4, A A)
δ(q4, a, A)   ⟶ (q5, A A)
δ(q5, a, A)   ⟶ (q6, A A)
δ(q6, a, A)   ⟶ (q7, A A)
δ(q7, a, A)   ⟶ (qf, A)
δ(q7, a, Z0)  ⟶ (qf, Z0)  

![Texto alternativo](img/PDA.png)
![Texto alternativo](img/tablaTransiciones.png)