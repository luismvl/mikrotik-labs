# Contexto

La seguridad basica de RouterOS comienza con la gestion de usuarios y servicios. Un router expuesto con servicios innecesarios activos representa un riesgo. En este laboratorio endureceras el acceso administrativo.

# Objetivos

1. Crear un usuario adicional con grupo full y contrasena segura.
2. Deshabilitar servicios innecesarios (telnet, ftp, www-ssl si no se usan).
3. Verificar la lista de usuarios activos.
4. Configurar el nombre del router (system identity).

# Tareas

1. Conectate a r1 por WinBox o SSH.
2. Configura la identidad del router como `MTCNA-LAB-002`.
3. Crea un nuevo usuario llamado `alumno` con grupo `full` y una contrasena distinta a `admin`.
4. Deshabilita los servicios que no necesitas: telnet, ftp, api, api-ssl.
5. Asegurate de que ssh, www y winbox permanezcan activos.
6. Cierra la sesion y vuelve a entrar con el nuevo usuario `alumno`.
7. Verifica que el usuario `admin` sigue existiendo pero que las credenciales nuevas funcionan.

# Verificacion esperada

- El comando `/user print` muestra al menos dos usuarios: `admin` y `alumno`.
- `/ip service print` muestra telnet, ftp, api y api-ssl como `disabled=yes`.
- Puedes iniciar sesion con el usuario `alumno`.

# Entrega

- Salida de `/user print`.
- Salida de `/ip service print`.
- Salida de `/system identity print`.
