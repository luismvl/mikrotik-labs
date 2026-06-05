# OSPF virtual links concepts

## Contexto

Este laboratorio pertenece al track MTCRE. El objetivo no es copiar comandos: debes leer el escenario, decidir la estrategia de routing y verificar el resultado con herramientas de RouterOS.

## Escenario

Una empresa tiene tres routers. r2 actua como punto de transito entre la sede A y la sede B. El tema principal del ejercicio es: **OSPF virtual links concepts**.

## Requisitos

- Mantener administracion por WinBox, SSH y WebFig.
- Lograr conectividad entre las LAN simuladas de r1 y r3.
- Aplicar el comportamiento esperado para OSPF virtual links concepts.
- Documentar que rutas, reglas o parametros cambiaron.

## Restricciones

- No uses rutas por defecto para ocultar errores de diseno.
- No elimines la configuracion base de management.
- En caso de varias soluciones posibles, elige la mas simple y justificable para MTCRE.

## Verificacion esperada

- La tabla de rutas muestra el camino esperado.
- Un traceroute desde r1 hacia la LAN de r3 usa el recorrido previsto.
- Si el lab trata failover o troubleshooting, el resultado cambia de forma controlada al simular una falla.
- Puedes explicar por que RouterOS eligio esa ruta.

## Entrega

- Captura o copia de `/ip/route/print detail`.
- Resultado de `/tool/traceroute` o `/ping`.
- Nota corta con el razonamiento de seleccion de ruta.
