# Contexto

La cadena `input` del firewall en RouterOS protege el propio router de accesos no deseados. Aplicar reglas bien estructuradas en `input` es fundamental para cualquier despliegue en produccion.

# Objetivos

1. Crear reglas input para permitir conexiones establecidas y relacionadas.
2. Permitir acceso SSH y WinBox solo desde la red LAN.
3. Deshabilitar (drop) el acceso por defecto al router desde WAN.
4. Verificar contadores de reglas con `/ip firewall filter print`.

# Tareas

1. Conectate a r1.
2. Crea una regla para aceptar trafico `established` y `related` en la cadena `input`.
3. Crea una regla que acepte conexiones SSH (puerto 22) solo si provienen de `192.168.77.0/24`.
4. Crea una regla que acepte conexiones WinBox (puerto 8291) solo desde `192.168.77.0/24`.
5. Crea una regla al final de la cadena `input` que descarte todo el trafico que llegue por `ether1` (WAN).
6. Asegurate de no perder acceso: verifica que tu conexion actual proviene de la LAN.
7. Genera trafico de prueba (intenta conectar desde WAN si tienes acceso) y observa los contadores.
8. Revisa `/ip firewall filter print stats` para ver contadores.

# Verificacion esperada

- `/ip firewall filter print` muestra al menos 4 reglas: established/related, SSH, WinBox, drop WAN.
- Los contadores de las reglas crecen al generar trafico correspondiente.
- El acceso desde la LAN funciona normalmente.

# Entrega

- Salida de `/ip firewall filter print`.
- Explicacion del orden de las reglas y por que es importante.
