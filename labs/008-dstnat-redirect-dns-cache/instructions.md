# Contexto

El dstNAT permite redirigir trafico entrante hacia servicios internos, mientras que el cache DNS local acelera las consultas de los clientes. Este laboratorio combina ambos conceptos.

# Objetivos

1. Redirigir el trafico DNS entrante al puerto 53 del router.
2. Configurar dstNAT para publicar un servicio TCP interno.
3. Verificar reglas NAT con `/ip firewall nat print`.
4. Consultar el cache DNS con `/ip dns cache print`.

# Tareas

1. Conectate a r1.
2. Configura el cache DNS local con servidores upstream y `allow-remote-requests=yes`.
3. Crea una regla dstNAT que redirija cualquier consulta DNS UDP/TCP al puerto 53 del router (redireccion de puerto).
4. Configura el servidor DHCP de la LAN para entregar como DNS la IP de r1.
5. Desde el cliente Linux, haz una consulta DNS (ej. `nslookup google.com 192.168.50.1`).
6. Revisa el cache DNS con `/ip dns cache print`.
7. (Opcional) Crea una regla dstNAT que publique el puerto 80 de un servicio web interno hacia la IP de r1.

# Verificacion esperada

- `/ip firewall nat print` muestra al menos una regla en la cadena `dstnat`.
- La consulta DNS desde el cliente responde correctamente.
- `/ip dns cache print` muestra entradas resueltas.

# Entrega

- Salida de `/ip firewall nat print`.
- Salida de `/ip dns cache print`.
- Captura de la consulta DNS desde el cliente Linux.
