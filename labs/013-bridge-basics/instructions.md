# Contexto

Un bridge en RouterOS permite unir multiples interfaces Ethernet en un solo dominio de broadcast. Es la base de las redes conmutadas y es fundamental para segmentos LAN donde los dispositivos deben comunicarse como si estuvieran en la misma red fisica.

# Objetivos

1. Crear un bridge y agregarle puertos Ethernet.
2. Asignar una direccion IP al bridge.
3. Verificar la tabla de hosts del bridge (`/interface bridge host print`).
4. Confirmar conectividad entre dispositivos a traves del bridge.

# Tareas

1. Conectate a r1.
2. Crea un bridge llamado `bridge1`.
3. Agrega `ether2` y `ether3` como puertos del bridge.
4. Asigna la direccion IP `192.168.13.1/24` al bridge.
5. Verifica que los puertos aparecen activos en `/interface bridge port print`.
6. Genera trafico desde los clientes conectados y revisa `/interface bridge host print`.
7. Comprueba conectividad con ping entre los clientes.

# Verificacion esperada

- `/interface bridge print` muestra `bridge1` con los puertos agregados.
- `/interface bridge host print` muestra direcciones MAC aprendidas de los clientes.
- Los clientes pueden hacerse ping entre si a traves del bridge.

# Entrega

- Salida de `/interface bridge print` y `/interface bridge host print`.
- Explicacion de la diferencia entre agregar una IP a una interfaz fisica y a un bridge.
