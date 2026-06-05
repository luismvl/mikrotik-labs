# Contexto

Este laboratorio requiere un router MikroTik con radio wireless real (no CHR). Este es el modo **Plan B** (manual guiado) para cuando el MikroTik fisico no puede ser alcanzado por el servidor de laboratorios. No se requiere que el router este conectado a este servidor.

Para completar el lab, necesitas acceso directo al router: por WinBox, WebFig o un cable de consola (si aplica). Si el router tiene una configuracion previa y no sabes la contrasena, puedes hacer un reset a **no-defaults** solo si es seguro y tienes permiso para hacerlo.

# Opciones de conexion

- **Cercania**: coloca una laptop o telefono cerca del MikroTik para detectar la senal del SSID.
- **Acceso directo**: conecta por WinBox o WebFig directamente al router (MAC address o IP del puerto ethernet).
- **Reset opcional**: si es necesario y seguro, reset a no-defaults para partir de cero.

# Objetivos

1. Configurar un AP wireless con SSID y seguridad WPA2 en un router MikroTik fisico.
2. Activar un servidor DHCP para la red wireless local.
3. Verificar que un cliente se conecta y obtiene lease DHCP.
4. Confirmar conectividad hacia el gateway MikroTik desde el cliente.

# Tareas

1. Accede al router MikroTik (WinBox, WebFig o consola).
2. Si partes de no-defaults, asigna una IP de gestion a un puerto ethernet.
3. Configura `/interface wireless`:
   - Modo `ap-bridge`.
   - SSID `MTCNA-Lab-020`.
   - Banda preferida (por ejemplo, 2.4 GHz-b/g/n).
   - Canal limpio (1, 6 u 11 en 2.4 GHz).
4. Configura un security profile con WPA2-Personal y una clave precompartida `MikroTik2024`.
5. Asigna la interfaz wireless a un bridge (o usa la interfaz directa) con IP `192.168.88.1/24`.
6. Crea un pool `wifi-pool` con rango `192.168.88.10-192.168.88.100`.
7. Configura un servidor DHCP en la interfaz wireless (o bridge) usando el pool.
8. Desde una laptop o telefono, busca el SSID `MTCNA-Lab-020`, conectate y verifica que obtienes IP.
9. Desde el cliente, haz ping a `192.168.88.1`.

# Verificacion esperada

- El SSID `MTCNA-Lab-020` es visible desde el cliente.
- El cliente se conecta exitosamente con la clave WPA2.
- En `/ip dhcp-server lease print` aparece una entrada dinamica con la MAC del cliente.
- El ping al gateway `192.168.88.1` desde el cliente responde exitosamente.
- En `/interface wireless registration-table print` aparece el cliente registrado.

# Entrega

- Captura de pantalla o salida de `/interface wireless registration-table print`.
- Captura de pantalla o salida de `/ip dhcp-server lease print`.
- Resultado del ping desde el cliente hacia `192.168.88.1`.
- Breve nota indicando como accediste al router (WinBox, WebFig, consola).
