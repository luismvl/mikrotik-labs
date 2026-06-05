# Contexto

RouterOS incluye un conjunto de herramientas de diagnostico esenciales para el trabajo diario de un administrador de red: `ping`, `traceroute`, `torch` y `netwatch`. Estas herramientas permiten verificar conectividad, trazar rutas, analizar trafico en tiempo real y monitorear hosts de forma automatica.

# Objetivos

1. Usar ping para verificar conectividad basica entre routers.
2. Usar traceroute para identificar la ruta entre dos puntos.
3. Usar torch para analizar trafico en tiempo real en una interfaz.
4. Configurar netwatch para monitorear un host y ejecutar acciones automaticas.

# Tareas

1. Conectate a r1 y a r2.
2. En r1, ejecuta `/ping 10.23.0.2 count=10` y verifica que responde.
3. En r1, ejecuta `/tool traceroute 10.23.2.1` y verifica que la ruta pasa por `10.23.0.2`.
4. En r1, ejecuta `/tool torch ether2 src-mac=yes` mientras generas trafico desde r2 hacia r1 con ping.
5. En r1, configura `/tool netwatch` para monitorear `10.23.0.2` cada 5 segundos. Define:
   - `up-script`: logear "Host r2 UP".
   - `down-script`: logear "Host r2 DOWN".
6. En r1, revisa `/log print` para ver las entradas de netwatch.
7. Simula una caida de conectividad: deshabilita `ether2` en r2 momentaneamente y verifica que netwatch detecta el cambio.
8. Vuelve a habilitar `ether2` en r2 y confirma que netwatch marca el host como UP.

# Verificacion esperada

- `/ping 10.23.0.2` muestra paquetes recibidos sin perdida.
- `/tool traceroute 10.23.2.1` muestra al menos dos saltos.
- `/tool torch` muestra trafico en `ether2` mientras hay ping.
- `/tool netwatch print` muestra un host monitoreado con estado `up`.
- `/log print` contiene mensajes de netwatch.

# Entrega

- Salida de `/ping 10.23.0.2 count=10` en r1.
- Salida de `/tool traceroute 10.23.2.1` en r1.
- Salida de `/tool torch` mostrando trafico.
- Salida de `/tool netwatch print` y `/log print` en r1.
