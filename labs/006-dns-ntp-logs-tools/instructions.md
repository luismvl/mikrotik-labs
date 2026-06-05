# Contexto

Los servicios de soporte como DNS, NTP y logging son esenciales para el correcto funcionamiento y mantenimiento de una red. Ademas, RouterOS incluye herramientas de diagnostico como ping y traceroute.

# Objetivos

1. Configurar servidores DNS y activar el allow-remote-requests.
2. Habilitar el cliente NTP y sincronizar la hora.
3. Consultar logs recientes con `/log print`.
4. Usar herramientas de red (ping, traceroute) desde el router.

# Tareas

1. Conectate a r1.
2. Configura los servidores DNS: `8.8.8.8` y `1.1.1.1`.
3. Habilita `allow-remote-requests` para que el router actue como cache DNS.
4. Configura el cliente NTP con el servidor `pool.ntp.org`.
5. Espera unos segundos y verifica la hora del sistema con `/system clock print`.
6. Realiza una consulta DNS desde el router: `/resolve pool.ntp.org`.
7. Revisa los logs recientes con `/log print`.
8. Ejecuta ping y traceroute hacia `8.8.8.8`.

# Verificacion esperada

- `/ip dns print` muestra servidores configurados y `allow-remote-requests: yes`.
- `/system ntp client print` muestra estado `synchronized` o al menos `started`.
- `/resolve` devuelve una IP.
- Los comandos `/ping` y `/tool traceroute` generan salida exitosa.

# Entrega

- Salida de `/ip dns print`.
- Salida de `/system ntp client print`.
- Salida de `/log print`.
- Resultados de ping y traceroute.
