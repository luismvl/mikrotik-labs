# Contexto

Este laboratorio introduce los metodos de acceso a un router MikroTik recien encendido. RouterOS expone varios servicios para la gestion inicial: WinBox, SSH, WebFig y Telnet. En este ejercicio practicaras cada uno de ellos.

# Objetivos

1. Conectar al router mediante WinBox usando el host del panel de acceso y el puerto publicado.
2. Conectar por SSH y cambiar la contrasena del usuario admin.
3. Acceder a WebFig desde el navegador.
4. Verificar que los servicios SSH, Telnet, WinBox y Web estan habilitados.

# Tareas

1. Despliega el laboratorio con containerlab.
2. Conectate por WinBox usando el host que muestra el panel de acceso y el puerto mapeado `43291`.
3. Abre una sesion SSH a r1 en el puerto `43221` con usuario `admin` y contrasena `admin`.
4. Cambia la contrasena del usuario `admin` por una segura.
5. Accede a WebFig en el puerto `43281` y verifica que puedes ver el menu principal.
6. Revisa los servicios activos desde la terminal con `/ip service print`.

# Verificacion esperada

- Puedes conectar por WinBox, SSH y WebFig sin errores.
- La contrasena de admin ha sido modificada.
- Los servicios ssh, www y winbox aparecen como disabled=no.

# Entrega

- Screenshot de la ventana de WinBox conectada a r1.
- Salida del comando `/ip service print`.
