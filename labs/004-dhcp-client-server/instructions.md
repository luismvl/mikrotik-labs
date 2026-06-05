# Contexto

El DHCP simplifica la gestion de direcciones IP en redes locales. RouterOS puede actuar como cliente DHCP (para obtener IP de un proveedor) y como servidor DHCP (para entregar IPs a clientes locales). En este laboratorio configuraras ambos roles.

# Objetivos

1. Configurar un cliente DHCP en la interfaz WAN (ether1).
2. Crear un pool de direcciones para la red LAN.
3. Configurar un servidor DHCP en la interfaz LAN.
4. Verificar que el cliente Linux recibe IP por DHCP.
5. Revisar leases activas con `/ip dhcp-server lease print`.

# Tareas

1. Conectate a r1.
2. En `ether1`, configura un cliente DHCP para obtener IP automaticamente.
3. Crea un pool llamado `lan-pool` con el rango `192.168.20.10-192.168.20.100`.
4. Asigna la IP `192.168.20.1/24` a `ether2`.
5. Configura un servidor DHCP en `ether2` usando el pool `lan-pool`.
6. Configura los parametros de red: gateway `192.168.20.1` y DNS `8.8.8.8`.
7. En el contenedor cliente, solicita IP por DHCP (puedes reiniciar la interfaz o usar `udhcpc`).
8. Verifica que el cliente obtuvo IP del rango configurado.

# Verificacion esperada

- `/ip dhcp-client print` muestra una asignacion en `ether1`.
- `/ip dhcp-server lease print` muestra al menos un lease dinamico con la MAC del cliente.
- El cliente Linux tiene una IP dentro del rango `192.168.20.10-192.168.20.100`.

# Entrega

- Salida de `/ip dhcp-server lease print`.
- Salida de `/ip dhcp-client print`.
- Captura de `ip addr` en el cliente Linux.
