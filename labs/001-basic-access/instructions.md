# Contexto

Este laboratorio introduce los metodos de acceso a un router MikroTik recien encendido. RouterOS expone varios servicios para la gestion inicial: WinBox, SSH, WebFig y Telnet. En este ejercicio practicaras cada uno de ellos.

# Objetivos

1. Conectar al router mediante WinBox usando la direccion MAC.
2. Conectar por SSH y cambiar la contrasena del usuario admin.
3. Acceder a WebFig desde el navegador.
4. Verificar que los servicios SSH, Telnet, WinBox y Web estan habilitados.

# Tareas

1. Despliega el laboratorio con containerlab.
2. Identifica la direccion MAC de la interfaz de r1 usando WinBox (modo Neighbors).
3. Conectate por WinBox (puerto mapeado 18001 tambien disponible) y verifica la identidad del router.
4. Abre una sesion SSH a r1 en el puerto 12001 con usuario `admin` y contrasena `admin`.
5. Cambia la contrasena del usuario `admin` por una segura.
6. Accede a WebFig en el puerto 8081 y verifica que puedes ver el menu principal.
7. Revisa los servicios activos desde la terminal con `/ip service print`.

# Verificacion esperada

- Puedes conectar por WinBox, SSH y WebFig sin errores.
- La contrasena de admin ha sido modificada.
- Los servicios ssh, www y winbox aparecen como disabled=no.

# Entrega

- Screenshot de la ventana de WinBox conectada a r1.
- Salida del comando `/ip service print`.
