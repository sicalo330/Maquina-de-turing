Autor:Noah Esteban Narváez Jung
Fase 1
Este proyecto requiere validar cadenas formadas únicamente por símbolos alfanuméricos, donde la Máquina de Turing debe detectar el final de la palabra mediante un símbolo de blanco _.
El regex garantiza exactamente ese comportamiento:
-^[a-zA-Z0-9]+_$ es el regiex que se eligió y acepta tanto números como dígitos
-_ representa el espacio blanco
-^ y $ → Aseguran que toda la cadena cumpla el patrón y no contenga otros símbolos
Este regex coincide con la validación implementada en el cógigo, donde cada símbolo se verifica usando:
/^[a-zA-Z0-9]$/.test(symbol)
