# Contexto

El control de ancho de banda es una de las tareas mas comunes en redes gestionadas con MikroTik. RouterOS ofrece el menu `/queue` para clasificar, limitar y priorizar trafico. Las `simple queues` son la forma mas directa de aplicar QoS a un objetivo (target) especifico: una IP, una red, una interfaz o una direccion de destino.

# Objetivos

1. Configurar una simple queue con target en una red o IP especifica.
2. Aplicar un limite maximo de subida y bajada (max-limit).
3. Verificar que la queue se activa y contabiliza trafico.
4. Entender la diferencia entre target, dst y la interfaz de aplicacion.

# Tareas

1. Conectate a r1.
2. Crea una simple queue con target `10.21.0.2/32` (r2), nombre `limite-r2`.
3. Aplica `max-limit=1M/2M` (subida 1 Mbps, bajada 2 Mbps).
4. Configura otra simple queue con target `10.21.0.0/30` (la red entre r1 y r2), nombre `limite-red`, con `max-limit=512k/1M`.
5. En r2, haz ping a r1 (`10.21.0.1`) y genera trafico con `/tool bandwidth-test` (o ping con tamano grande).
6. En r1, revisa `/queue simple print` y observa los contadores `rate` y `packets`.
7. Modifica la primera queue agregando `dst=10.21.0.2/32` para que limite solo el trafico hacia r2.
8. Verifica que ambas queues aparecen `active` y acumulan trafico.

# Verificacion esperada

- `/queue simple print` muestra al menos dos queues con `target` y `max-limit` configurados.
- Al menos una queue muestra `rate` mayor a cero despues de generar trafico.
- No hay errores de configuracion (sintaxis valida en RouterOS).

# Entrega

- Salida de `/queue simple print` en r1.
- Salida de `/queue simple print stats` (o `print detail`) que muestre rate/packets.
- Breve explicacion de como funcionan `target` y `dst` en simple queues.
