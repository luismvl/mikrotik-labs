# Contexto

La cadena `forward` del firewall en RouterOS controla el trafico que atraviesa el router entre redes. Configurar reglas en `forward` permite filtrar comunicaciones entre LAN, WAN y otros segmentos.

# Objetivos

1. Crear reglas forward para permitir conexiones establecidas y relacionadas.
2. Permitir trafico desde LAN hacia WAN y bloquear trafico entrante no solicitado.
3. Filtrar protocolos especificos (por ejemplo, ICMP) entre segmentos.
4. Verificar contadores y orden de reglas con `/ip firewall filter print`.

# Tareas

1. Conectate a r1.
2. Crea una regla para aceptar trafico `established` y `related` en la cadena `forward`.
3. Crea una regla que permita todo el trafico saliente desde `192.168.10.0/24` hacia cualquier destino.
4. Crea una regla que descarte trafico nuevo que entre desde `ether1` (WAN) hacia la LAN.
5. Opcional: bloquea ICMP entre la LAN y la WAN para practicar filtrado de protocolos.
6. Genera trafico de prueba y observa los contadores de las reglas.
7. Revisa `/ip firewall filter print stats` para verificar el comportamiento.

# Verificacion esperada

- `/ip firewall filter print` muestra al menos 3 reglas: established/related, permitir LAN, descartar WAN nuevo.
- Los contadores de las reglas crecen al generar trafico correspondiente.
- El trafico desde LAN hacia WAN funciona; el trafico entrante no solicitado es bloqueado.

# Entrega

- Salida de `/ip firewall filter print`.
- Explicacion del orden de las reglas y como afecta el flujo de paquetes.
