# Contexto

El enrutamiento estatico permite a un router alcanzar redes que no estan directamente conectadas. En este lab, dos routers estan conectados por un enlace punto a punto y cada uno tiene una red LAN detras. Debes configurar rutas estaticas para que ambas redes se comuniquen.

# Objetivos

1. Agregar una ruta estatica en r1 para alcanzar la red detras de r2.
2. Agregar una ruta estatica en r2 para alcanzar la red detras de r1.
3. Verificar la tabla de rutas con `/ip route print`.
4. Confirmar conectividad con ping entre redes distantes.

# Tareas

1. Conectate a r1 y r2.
2. En r1, revisa la tabla de rutas con `/ip route print`.
3. Agrega una ruta estatica en r1 para la red `172.16.0.0/24` usando como gateway `10.16.0.2`.
4. En r2, agrega una ruta estatica para la red `192.168.16.0/24` usando como gateway `10.16.0.1`.
5. Verifica que ambas rutas aparecen como `active` en `/ip route print`.
6. Desde r1, haz ping a `172.16.0.1`.
7. Desde r2, haz ping a `192.168.16.1`.

# Verificacion esperada

- `/ip route print` en r1 muestra una ruta `dst-address=172.16.0.0/24` con gateway `10.16.0.2`.
- `/ip route print` en r2 muestra una ruta `dst-address=192.168.16.0/24` con gateway `10.16.0.1`.
- El ping entre routers a traves de las redes distantes funciona.

# Entrega

- Salida de `/ip route print` en ambos routers.
- Resultado del ping entre las redes distantes.
