# Contexto

La gestion de la configuracion en RouterOS incluye dos mecanismos principales: el backup binario (`.backup`) y el export de texto (`.rsc`). El backup binario restaura la configuracion completa, incluyendo usuarios y contrasenas, pero es especifico del hardware. El export de texto es portable y puede editarse, pero no incluye ciertos datos sensibles por defecto.

Ademas, RouterOS permite ejecutar un reset de configuracion (con o sin defaults) para volver a un estado inicial. Este laboratorio practica estas operaciones esenciales de administracion.

# Objetivos

1. Crear un backup binario (.backup) de la configuracion actual.
2. Generar un export de texto (.rsc) con la configuracion completa.
3. Identificar la diferencia entre backup binario y export de texto.
4. Restaurar la configuracion desde un backup binario.

# Tareas

1. Conectate a r1.
2. Verifica la configuracion inicial: `/ip address print`, `/ip dhcp-server print`, `/ip pool print`.
3. Crea un backup binario con `/system backup save name=lab022-backup`.
4. Genera un export de texto con `/export file=lab022-export`.
5. Lista los archivos en el router con `/file print` para confirmar ambos existen.
6. Elimina la IP de `ether2` y deshabilita el servidor DHCP para simular un cambio.
7. Restaura el backup binario con `/system backup load name=lab022-backup`.
8. Verifica que la IP de `ether2` y el servidor DHCP volvieron a estar activos.
9. Genera un nuevo export con `/export file=lab022-export2` y compara el tamano con el anterior.

# Verificacion esperada

- `/file print` muestra `lab022-backup.backup` y `lab022-export.rsc`.
- Despues de restaurar el backup, `/ip address print` muestra la IP `192.168.22.1/24` en `ether2`.
- `/ip dhcp-server print` muestra el servidor `dhcp-lan` activo en `ether2`.

# Entrega

- Salida de `/file print` mostrando los archivos de backup y export.
- Salida de `/ip address print` y `/ip dhcp-server print` antes y despues del restore.
- Breve explicacion de la diferencia entre backup binario y export de texto.
