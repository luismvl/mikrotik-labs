# Contexto

PPPoE (Point-to-Point Protocol over Ethernet) es un metodo comun para establecer conexiones autenticadas sobre Ethernet, tipico en redes de proveedores de Internet. En este lab, un router actua como servidor PPPoE y el otro como cliente.

# Objetivos

1. Configurar un servidor PPPoE en r1 con un perfil y un usuario local.
2. Configurar un cliente PPPoE en r2 para conectarse a r1.
3. Verificar que la interfaz PPPoE-cliente esta `running` en r2.
4. Confirmar conectividad a traves del enlace PPPoE.

# Tareas

1. Conectate a r1.
2. Crea un perfil PPPoE llamado `pppoe-profile` con direccionamiento local.
3. Crea un usuario `labuser` con contrasena `labpass` en `/ppp secret`.
4. Habilita el servidor PPPoE en `ether2` usando el perfil creado.
5. Conectate a r2.
6. Crea una interfaz `pppoe-client` en `ether2` con el usuario `labuser` y contrasena `labpass`.
7. Verifica el estado de la interfaz con `/interface pppoe-client print`.
8. Comprueba que r2 recibe una IP y puede hacer ping a r1 a traves del enlace PPPoE.

# Verificacion esperada

- `/interface pppoe-client print` en r2 muestra la interfaz como `running`.
- r2 tiene una direccion IP asignada dinamicamente por el servidor PPPoE.
- El ping entre r1 y r2 a traves del enlace PPPoE funciona.

# Entrega

- Salida de `/interface pppoe-client print` en r2.
- Salida de `/ppp active print` en r1.
- Resultado del ping a traves del enlace PPPoE.
