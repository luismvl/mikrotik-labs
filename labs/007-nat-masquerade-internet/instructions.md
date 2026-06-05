# Contexto

El NAT masquerade es la tecnica mas comun para permitir que una red privada acceda a Internet usando una unica IP publica. En este laboratorio configuraras un router de borde (r1) conectado a un router ISP simulado (r2).

# Objetivos

1. Configurar una regla srcnat masquerade en la interfaz WAN.
2. Verificar que los clientes LAN pueden hacer ping a una IP de Internet simulada.
3. Revisar conexiones activas con `/ip firewall connection print`.
4. Comprobar la tabla de rutas para la ruta por defecto.

# Tareas

1. Despliega el laboratorio (r1, r2 y client).
2. Conectate a r1.
3. Configura `ether1` (WAN) con IP estatica o cliente DHCP segun el enlace hacia r2.
4. Asegurate de que `ether2` (LAN) tenga IP `192.168.100.1/24`.
5. Configura el cliente Linux para usar gateway `192.168.100.1`.
6. Crea una regla NAT masquerade: cadena `srcnat`, accion `masquerade`, out-interface `ether1`.
7. Configura una ruta por defecto en r1 hacia r2 (o verifica que la obtiene por DHCP).
8. Desde el cliente Linux, haz ping a la IP de r2 en el enlace WAN.
9. Revisa las conexiones activas en r1.

# Verificacion esperada

- `/ip firewall nat print` muestra una regla `masquerade` en `srcnat`.
- El cliente Linux puede hacer ping a la IP WAN de r2.
- `/ip route print` muestra una ruta por defecto activa.
- `/ip firewall connection print` muestra conexiones con origen en la LAN.

# Entrega

- Salida de `/ip firewall nat print`.
- Salida de `/ip route print`.
- Resultado del ping desde el cliente Linux.
- Salida de `/ip firewall connection print`.
