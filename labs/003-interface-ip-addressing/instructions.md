# Contexto

Antes de configurar servicios de red, debes entender como RouterOS maneja interfaces Ethernet y direcciones IP. Este laboratorio cubre la asignacion basica de IPs y la verificacion de conectividad.

# Objetivos

1. Asignar una direccion IP a la interfaz LAN (ether2).
2. Verificar las interfaces con `/interface print`.
3. Comprobar conectividad con ping desde el router.
4. Verificar la tabla de rutas con `/ip route print`.

# Tareas

1. Despliega el laboratorio. Conectate a r1.
2. Revisa las interfaces disponibles con `/interface print`.
3. Asigna la IP `192.168.10.1/24` a la interfaz `ether2`.
4. Verifica que la IP quedo asignada con `/ip address print`.
5. Desde el router, haz ping a la interfaz del cliente Linux (puedes verificar su IP desde el contenedor).
6. Revisa la tabla de rutas con `/ip route print` y explica por que aparece la red conectada.
7. (Opcional) Agrega una segunda IP `10.0.0.1/24` en `ether2` como IP secundaria.

# Verificacion esperada

- `/ip address print` muestra `192.168.10.1/24` en `ether2`.
- El ping desde r1 al cliente es exitoso.
- La tabla de rutas incluye una ruta conectada (C) para `192.168.10.0/24`.

# Entrega

- Capturas o salida de `/interface print`, `/ip address print`, `/ip route print`.
- Resultado del ping.
